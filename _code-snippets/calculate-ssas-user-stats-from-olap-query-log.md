---
layout: snippet
title: Calculate SSAS User Stats from OLAP Query Log
description: 
tags:
  - ssas
  - sql
  - sql-server
language: sql
variables:
---

This query requires the OLAP Query Log to be enabled on a cube and writing to
a database table accessible to you.

<https://www.mssqltips.com/sqlservertutorial/3610/sql-server-analysis-services-query-log/>

Individual queries by users are grouped into a single "session" if they occur
within 15 minutes (900 seconds) of the previous query by the same user.

```sql
WITH query_difference
AS (SELECT
	[MSOLAP_Database],
    [MSOLAP_ObjectPath],
    [MSOLAP_User],
    [Dataset],
    [StartTime],
    [Duration],
	DATEADD(second, [Duration], [StartTime]) as [EndTime],
	LAG([StartTime]) OVER (
		PARTITION BY MSOLAP_Database, MSOLAP_USER
		ORDER BY MSOLAP_DATABASE, MSOLAP_USER, [StartTime]
		) as [PreviousStartTime],
	DATEDIFF(SECOND, LAG([StartTime]) OVER (
		PARTITION BY MSOLAP_Database, MSOLAP_USER
		ORDER BY MSOLAP_DATABASE, MSOLAP_USER, [StartTime]
		), [StartTime]) AS [SecondsSinceLastQuery]
  FROM [QTools].[dbo].[OlapQueryLog]
),
clustering
AS (SELECT
	*,
	CASE WHEN [SecondsSinceLastQuery] > 900 OR [SecondsSinceLastQuery] IS NULL
	THEN 1
	ELSE NULL
	END AS [NewClusterMarker]
	FROM query_difference
),
assigned_clustering
AS (SELECT
	*,
	COUNT([NewClusterMarker]) OVER (
		ORDER BY MSOLAP_DATABASE, MSOLAP_USER, [StartTime]
		ROWS UNBOUNDED PRECEDING
	) AS [ClusterId]
	FROM clustering
)
SELECT
	MIN([StartTime]) AS [StartTime],
	MAX([EndTime]) AS [EndTime],
	[MSOLAP_User],
	[MSOLAP_Database],
	[ClusterId],
	COUNT(*) AS [QueryCount]
INTO #tmp_ssas_usage
FROM assigned_clustering
GROUP BY [MSOLAP_Database],
	[MSOLAP_User],
	ClusterId
ORDER BY StartTime DESC, MSOLAP_User, MSOLAP_Database

SELECT TOP (1000) * FROM #tmp_ssas_usage
```

In this second query, the sessions are grouped by user, by day and used to
create a summary of how many users are accessing your cubes per day.

```sql
SELECT [Date], COUNT(*)
FROM (
	SELECT
    CAST(starttime AS DATE) AS [Date],
    msolap_user
  FROM #tmp_ssas_usage
	--WHERE msolap_database = 'ABC_Cube'
	GROUP BY CAST(starttime AS DATE), msolap_user
	--ORDER BY CAST(starttime AS DATE) DESC, msolap_user
) a
GROUP BY [Date]
ORDER BY [Date] DESC
```