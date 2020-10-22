---
layout: snippet
title: Accessing a SQLite database with Python
description: A reusable template for interacting with SQLite databases in Python
tags:
  - python
  - sqlite
language: python
variables:
---

```python
import pathlib

db_file = pathlib.Path('/some/directory/file.db')
with sqlite3.connect(str(db_file)) as conn:
    cur = conn.cursor()
    try:
        # Execute a script on the database
        cur.executescript("SELECT * FROM table")

        # Query the database and return results in a list of tuples
        samples = cur.execute('SELECT "INDEX", IP_ADDRESS, PORT, '
                              'SAMPLE FROM ES_SAMPLES'
                              ).fetchall()  # .fetchone()

        # Update single record in database
        cur.execute("UPDATE DOWNLOADS "
            "SET RELEASE_DATE = ? "
            "WHERE ID = ?",
            (date, idnum))

        # Insert multiple records into database
        results = [(1, '127.0.0.1'), (2, '192.168.1.1')]
        cur.executemany(
            'INSERT OR REPLACE INTO ES_SAMPLES '
            '(DOCUMENT_ID, IP_ADDRESS) '
            'VALUES (?, ?)',
            results)
    finally:
        conn.commit()
        cur.close()

```