---
layout: post
title: Designing a system for scheduling users in a worldwide organization
description: Some description
category: programming
tags:
  - database
headerImage:
headerImageAttrib:
---


Kind of a brain dump, but here are some things I'd want to keep in mind if I were working on this project:

* Different countries celebrate different holidays
* Even countries that *celebrate* a certain holiday might not require time off on that day (which I assume is the key detail you're trying to encode into your program)
* Even if a company declares a day a holiday, not all employees are going to be off that day (on-call, essential workers like grocery or EMS). This may/may not matter for your goals.
* Not all countries celebrate a certain holiday on the same day (e.g. Canadian Thanksgiving). This may be easily fixed by considering them separate holidays.
* A single company may not apply the same holiday schedule to all of its employees (e.g. their employees in India get Indian holidays off, U.S. employees get U.S. holidays off)
* Holidays are not always on the same *date* in each year (U.S. Thanksgiving is the 4th Thursday each November)
* If your project does tracking down to the hour, consider that time zones mean a single holiday is not necessarily celebrated in the same 24-hour bucket (New Years Day in Australia can be >12 hours difference from New Years in U.S.)
* A single holiday may span multiple days (Chinese New Year in China often lasts up to 1 week)
* A single holiday does not necessarily follow the same "rule pattern" every year, in perpetuity (U.S. Memorial day was celebrated May 30 until 1970, then moved to the last Monday of May)
* Companies do not necessarily "celebrate" a holiday on its federally-designated day (if Christmas falls on a Saturday, many companies give one day off in either the preceding or following week)

Given all of that, what I'd probably do is create a database table that simply holds a list of holidays, any appropriate Country/Company/Regional filters (to make sure it's possible to pull "all holidays that apply to Employee X"), and a start/end date for the holiday. This table has one row for each holiday for *each year*. you can use a .NET rule-based program or something to proactively fill the Holiday table as many years in advance as you need to plan for (but make sure more can be added later - some companies will release guidance in Q4 of one year designating a new holiday for the next fiscal year, so you've got to be able to support that).

Combine that holidays table with a [Calendar Table](https://www.sqlshack.com/designing-a-calendar-table/) (it can be pretty simple, just need the date really). If you want to know how many workdays exist between point A and B, just:

1. Join your Holidays table to the Calendar table to get a listing of all days covered. For example, your Holiday table may contain Start/End date but after joining you'll get a list of all consecutive days between the start and end.
2. Select all days from Calendar table except those in the "consecutive list of holidays" found in the previous step.
3. Further filter out days that don't match your desired date range.
4. Finally filter out weekends.
5. Count the number of days remaining.

Here's an example:

http://sqlfiddle.com/#!18/09204/16

Schema:

    CREATE TABLE Holidays (
        Name varchar(30) not null,
        StartDate datetime not null,
        EndDate datetime not null
    )

    INSERT INTO Holidays
    (Name, StartDate, EndDate)
    VALUES
    ('Christmas Eve', '2020-12-24', '2020-12-24'),
    ('Christmas', '2020-12-25', '2020-12-25'),
    ('Hanukkah', '2020-12-10', '2020-12-18')

    CREATE TABLE Calendar (
       CalendarDate DateTime not null,
       DayOfWeek varchar(10) not null
    )

    DECLARE @StartDate DATETIME
    DECLARE @EndDate DATETIME
    SET @StartDate = '2020-01-01'
    SET @EndDate = '2021-01-01'

    WHILE @StartDate <= @EndDate
          BEGIN
                 INSERT INTO [Calendar]
                 (
                       CalendarDate,
                       DayOfWeek
                 )
                 SELECT
                       @StartDate,
                       DATENAME(weekday, @StartDate)

                 SET @StartDate = DATEADD(dd, 1, @StartDate)
          END

Count Query:

    DECLARE @SpanStartDate datetime = '2020-12-01';
    DECLARE @SpanEndDate datetime = '2021-01-01';

    WITH spread_holidays AS (
        SELECT hol.Name, cal.CalendarDate, cal.DayOfWeek
        FROM Holidays hol
        JOIN calendar cal
        ON cal.CalendarDate >= hol.StartDate AND
           cal.CalendarDate <= hol.EndDate
    )
    SELECT COUNT(*)
    FROM (
      SELECT *
      FROM calendar cal
      WHERE
        NOT EXISTS (
          SELECT 1 FROM spread_holidays sh WHERE cal.CalendarDate = sh.CalendarDate
        ) AND
        DATEPART(WEEKDAY, CalendarDate) <> 7 AND  -- Saturday
        DATEPART(WEEKDAY, CalendarDate) <> 1 AND  -- Sunday
        cal.CalendarDate >= @SpanStartDate AND
        cal.CalendarDate <  @SpanEndDate
    ) a