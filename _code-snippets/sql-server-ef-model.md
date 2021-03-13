---
layout: snippet
title: Generate a C# Entity Framework model for a database table
description:
tags:
  - sql
  - sql-server
  - csharp
language: sql
variables:
  TABLE_NAME:
    replace: '[dbo].[ProductType]'
---

```sql
DECLARE @TableName sysname = '[dbo].[ProductType]';
DECLARE @FullTableName sysname = @TableName

DECLARE @PrimaryKey VARCHAR(200) = '';
DECLARE @TableNameMap VARCHAR(500);

SELECT  @PrimaryKey = REPLACE(ccu.COLUMN_NAME, '_', '') ,
        @TableNameMap = 'builder.ToTable("' + tc.TABLE_NAME + '", "' + tc.TABLE_SCHEMA
        + '");',
		@TableName = tc.TABLE_NAME
FROM    INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        LEFT JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu ON tc.CONSTRAINT_NAME = ccu.CONSTRAINT_NAME
WHERE   tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
        AND OBJECT_ID(@FullTableName) = OBJECT_ID(( tc.TABLE_SCHEMA + '.'
                                                + tc.TABLE_NAME ));

DECLARE @Result VARCHAR(MAX) = 'public class ' + REPLACE(REPLACE(REPLACE(@TableName, '_', ''), '[dbo].[',''), ']', '') + '
{';

SELECT  @Result = @Result + t.FormatString  +  '
    public ' + ColumnType + NullableSign + ' ' + ColumnName + ' { get; set; }'
FROM    ( SELECT    REPLACE(col.name, '_', '') ColumnName ,
                    column_id ColumnId ,
                    CASE 
                      WHEN typ.name = 'bigint' AND (REPLACE(col.name, '_', '') <> @PrimaryKey) THEN CHAR(10) + CHAR(9) + '[DisplayFormat(DataFormatString = "{0:n0}")]'
                      WHEN typ.name = 'float' AND (REPLACE(col.name, '_', '') <> @PrimaryKey) THEN CHAR(10) + CHAR(9) + '[DisplayFormat(DataFormatString = "{0:P2}")]'
                      ELSE ''
                    END FormatString,
                    CASE typ.name
                      WHEN 'bigint' THEN 'long'
                      WHEN 'binary' THEN 'byte[]'
                      WHEN 'bit' THEN 'bool'
                      WHEN 'char' THEN 'string'
                      WHEN 'date' THEN 'DateTime'
                      WHEN 'datetime' THEN 'DateTime'
                      WHEN 'datetime2' THEN 'DateTime'
                      WHEN 'datetimeoffset' THEN 'DateTimeOffset'
                      WHEN 'decimal' THEN 'decimal'
                      WHEN 'float' THEN 'double'
                      WHEN 'image' THEN 'byte[]'
                      WHEN 'int' THEN 'int'
                      WHEN 'money' THEN 'decimal'
                      WHEN 'nchar' THEN 'string'
                      WHEN 'ntext' THEN 'string'
                      WHEN 'numeric' THEN 'decimal'
                      WHEN 'nvarchar' THEN 'string'
                      WHEN 'real' THEN 'double'
                      WHEN 'smalldatetime' THEN 'DateTime'
                      WHEN 'smallint' THEN 'short'
                      WHEN 'smallmoney' THEN 'decimal'
                      WHEN 'text' THEN 'string'
                      WHEN 'time' THEN 'TimeSpan'
                      WHEN 'timestamp' THEN 'DateTime'
                      WHEN 'tinyint' THEN 'byte'
                      WHEN 'uniqueidentifier' THEN 'Guid'
                      WHEN 'varbinary' THEN 'byte[]'
                      WHEN 'varchar' THEN 'string'
                      ELSE 'UNKNOWN_' + typ.name
                    END ColumnType ,
                    CASE WHEN col.is_nullable = 1
                              AND typ.name IN ( 'bigint', 'bit', 'date',
                                                'datetime', 'datetime2',
                                                'datetimeoffset', 'decimal',
                                                'float', 'int', 'money',
                                                'numeric', 'real',
                                                'smalldatetime', 'smallint',
                                                'smallmoney', 'time',
                                                'tinyint', 'uniqueidentifier' )
                         THEN '?'
                         ELSE ''
                    END NullableSign
          FROM      sys.columns col
                    JOIN sys.types typ ON col.system_type_id = typ.system_type_id
                                          AND col.user_type_id = typ.user_type_id
          WHERE     object_id = OBJECT_ID(@TableName)
        ) t
ORDER BY ColumnId;

SET @Result = @Result + '
}' + CHAR(10) + CHAR(10);


SET @Result = @Result + 'public class ' + REPLACE(REPLACE(REPLACE(@TableName, '_', ''), '[dbo].[',''), ']', '') + 'Configuation : IEntityTypeConfiguration<' + REPLACE(REPLACE(REPLACE(@TableName, '_', ''), '[dbo].[',''), ']', '') +'>
{'



IF ( @PrimaryKey IS NOT NULL )
    SET @PrimaryKey = 'builder.HasKey(p => p.' + @PrimaryKey + ');';



SET @Result = @Result + CHAR(10) + CHAR(9)+ 'public void Configure(EntityTypeBuilder<' + @TableName + '> builder)
	{     
		' + @TableNameMap + '
		' + @PrimaryKey + '
		';

SELECT  @Result = @Result + '
		builder.Property(p => p.' + ColumnName + ').HasColumnName("' + ColumnName + '")'
        + NullableSign + max_length + ';'  --+ IsPrimaryKey + ColumnType + NullableSign + ' ' + ColumnName + ' { get; set; }'
FROM    ( SELECT    REPLACE(col.name, '_', '') ColumnName ,
                    column_id ColumnId ,
                    CASE typ.name
                      WHEN 'bigint' THEN 'long'
                      WHEN 'binary' THEN 'byte[]'
                      WHEN 'bit' THEN 'bool'
                      WHEN 'char' THEN 'string'
                      WHEN 'date' THEN 'DateTime'
                      WHEN 'datetime' THEN 'DateTime'
                      WHEN 'datetime2' THEN 'DateTime'
                      WHEN 'datetimeoffset' THEN 'DateTimeOffset'
                      WHEN 'decimal' THEN 'decimal'
                      WHEN 'float' THEN 'float'
                      WHEN 'image' THEN 'byte[]'
                      WHEN 'int' THEN 'int'
                      WHEN 'money' THEN 'decimal'
                      WHEN 'nchar' THEN 'string'
                      WHEN 'ntext' THEN 'string'
                      WHEN 'numeric' THEN 'decimal'
                      WHEN 'nvarchar' THEN 'string'
                      WHEN 'real' THEN 'double'
                      WHEN 'smalldatetime' THEN 'DateTime'
                      WHEN 'smallint' THEN 'short'
                      WHEN 'smallmoney' THEN 'decimal'
                      WHEN 'text' THEN 'string'
                      WHEN 'time' THEN 'TimeSpan'
                      WHEN 'timestamp' THEN 'DateTime'
                      WHEN 'tinyint' THEN 'byte'
                      WHEN 'uniqueidentifier' THEN 'Guid'
                      WHEN 'varbinary' THEN 'byte[]'
                      WHEN 'varchar' THEN 'string'
                      ELSE 'UNKNOWN_' + typ.name
                    END ColumnType ,
                    CASE WHEN col.is_nullable = 0
                              AND typ.name IN ( 'bigint', 'bit', 'date',
                                                'datetime', 'datetime2',
                                                'datetimeoffset', 'decimal',
                                                'float', 'int', 'money',
                                                'numeric', 'real',
                                                'smalldatetime', 'smallint',
                                                'smallmoney', 'time',
                                                'tinyint', 'uniqueidentifier' )
                         THEN '.IsRequired()'
                         ELSE ''
                    END NullableSign ,
                    CASE WHEN ( typ.name IN ( 'nvarchar', 'varchar', 'nchar',
                                              'char' ) )
                              AND COL_LENGTH(tc.TABLE_SCHEMA + '.'
                                             + tc.TABLE_NAME, col.[name]) > 0
                         THEN '.HasMaxLength('
                              + CAST(COL_LENGTH(tc.TABLE_SCHEMA + '.'
                                                + tc.TABLE_NAME, col.[name]) AS VARCHAR)
                              + ')'
                         ELSE ''
                    END AS max_length ,
                    CASE WHEN col.[name] = ccu.COLUMN_NAME
                         THEN REPLACE(col.name, '_', '')
                         ELSE @PrimaryKey
                    END AS IsPrimaryKey
          FROM      sys.columns col
                    JOIN sys.types typ ON col.system_type_id = typ.system_type_id
                                          AND col.user_type_id = typ.user_type_id
                    LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
                                                              AND OBJECT_ID(@FullTableName) = OBJECT_ID(( tc.TABLE_SCHEMA
                                                              + '.'
                                                              + tc.TABLE_NAME ))
                    LEFT JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu ON tc.CONSTRAINT_NAME = ccu.CONSTRAINT_NAME
                                                              AND col.[name] = ccu.COLUMN_NAME
          WHERE     object_id = OBJECT_ID(@FullTableName)
        ) t
ORDER BY ColumnId;

SET @Result = @Result + '
	}
}';

PRINT @Result;
```
