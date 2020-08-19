---
layout: snippet
title: Working with dates in SQL
tags:
  - sql
  - mssql
language: sql
variables:
---

Get the current date:

```sql
CURRENT_TIMESTAMP 
GETDATE() 
```

Get the first day of the month:

```sql
SELECT DATEADD(MONTH, -1, DATEADD(DAY, 1, EOMONTH(GETDATE()))) 
```

Turn DateTime into a Year-Month String

```sql
concat(datepart(year, CALENDAR_DATE), '-', right('00' + cast(datepart(month, CALENDAR_DATE) as varchar(2)), 2)) 
```

Turn DateTime into a Year-ISOWeek String 

```sql
concat(YEAR(DATEADD(day, 26 - DATEPART(isoww, CALENDAR_DATE), CALENDAR_DATE)), 'W', right('00' + cast(datepart(ISO_WEEK, CALENDAR_DATE) as varchar(2)), 2) 
```