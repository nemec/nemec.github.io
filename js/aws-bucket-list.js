/*
https://github.com/rufuspollock/s3-bucket-listing
Copyright 2012-2016 Rufus Pollock.

Licensed under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes)
{
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex)
        {

            if (this == null)
            {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. Let O be ? ToObject(this value).
            let o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            let len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0)
            {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            let n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y)
            {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len)
            {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement))
                {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

function sortFunction(sort_type, a, b)
{
    switch (sort_type)
    {
        case "OLD2NEW":
            return a.LastModified > b.LastModified ? 1 : -1;
        case "NEW2OLD":
            return a.LastModified < b.LastModified ? 1 : -1;
        case "A2Z":
            return a.Key < b.Key ? 1 : -1;
        case "Z2A":
            return a.Key > b.Key ? 1 : -1;
        case "BIG2SMALL":
            return a.Size < b.Size ? 1 : -1;
        case "SMALL2BIG":
            return a.Size > b.Size ? 1 : -1;
    }
}

function getS3Data(config, marker, html)
{
    let default_config = {
        protocol: 'https',
        bucket_name: 'dl.ncsbe.gov',
        bucket_url: 'https://s3.amazonaws.com',
        root_dir: '',
        sort: 'DEFAULT',
        exclude_files: [],
        auto_title: true,
        s3_region: 's3'
    };
    config = config || {};
    config = Object.assign({}, default_config, config);

    let bucket_website_url = config.bucket_url;

    if (typeof config.auto_title !== 'undefined' && config.auto_title === true)
    {
        document.title = config.bucket_name;
    }

    if (config.s3_region !== '')
    {
        config.bucket_url = config.protocol + '://' + config.bucket_name + '.' + config.s3_region + '.amazonaws.com'; // e.g. just 's3' for us-east-1 region
    }

    if (config.bucket_name !== '')
    {
        // if bucket_url does not start with bucket_name,
        // assume path-style url
        if (!~config.bucket_url.indexOf(config.protocol + '://' + config.bucket_name))
        {
            config.bucket_url += '/' + config.bucket_name;
        }
        bucket_website_url = config.bucket_url;
    }

    console.log({
        bucket_url: config.bucket_url,
        bucket_website_url
    })

    let s3_rest_url = createS3QueryUrl(config, marker);
    // set loading notice
    $('#listing')
        .html('<img src="/images/2021/03/ajaxload-circle.gif" />');
    $.get(s3_rest_url)
        .done(function (data)
        {
            // clear loading notice
            $('#listing').html('');
            let xml = $(data);
            let info = getInfoFromS3Data(xml);

            if (config.sort != 'DEFAULT')
            {
                let sort_closure = function (a, b)
                {
                    sortFunction(config.sort, a, b);
                }
                info.files.sort(sort_closure);
                info.directories.sort(sort_closure);
            }

            buildNavigation(info, bucket_website_url);

            // Add a <base> element to the document head to make relative links
            // work even if the URI does not contain a trailing slash
            let base = window.location.href;
            base = (base.endsWith('/')) ? base : base + '/';
            $('head').append('<base href="' + base + '">');

            html = typeof html !== 'undefined'
                ? html + prepareTable(config, info, bucket_website_url)
                : prepareTable(config, info, bucket_website_url);
            if (info.nextMarker != "null")
            {
                getS3Data(info.nextMarker, html);
            } else
            {
                document.getElementById('listing').innerHTML =
                    '<pre>' + html + '</pre>';
            }
        })
        .fail(function (error)
        {
            console.error(error);
            $('#listing').html('<strong>Error: ' + JSON.stringify(error) + '</strong>');
        });
}

function buildNavigation(info, bucket_website_url)
{
    let baseUrl = location.pathname + '?prefix=';
    let root = '<a href="' + baseUrl + '">' + bucket_website_url + '</a> / ';
    if (info.prefix)
    {
        let processedPathSegments = '';
        let content = $.map(info.prefix.split('/'), function (pathSegment)
        {
            processedPathSegments =
                processedPathSegments + encodeURIComponent(pathSegment) + '/';
            return '<a href="' + baseUrl + processedPathSegments.replace(/"/g, '&quot;') + '">' +
                pathSegment + '</a>';
        });
        $('#navigation').html(root + content.join(' / '));
    } else
    {
        $('#navigation').html(root);
    }
}

function createS3QueryUrl(config, marker)
{
    let s3_rest_url = config.bucket_url;
    s3_rest_url += '?delimiter=/';

    let rx = '.*[?&]prefix=' + config.root_dir + '([^&]+)(&.*)?$';
    let prefix = '';
    let match = location.search.match(rx);
    if (match)
    {
        prefix = config.root_dir + match[1];
    } else
    {
        prefix = config.root_dir;
    }
    if (prefix)
    {
        // make sure we end in /
        prefix = prefix.replace(/\/$/, '') + '/';
        s3_rest_url += '&prefix=' + prefix;
    }
    if (marker)
    {
        s3_rest_url += '&marker=' + marker;
    }
    return s3_rest_url;
}

function getInfoFromS3Data(xml)
{
    let prefix = $(xml.find('Prefix')[0]).text();
    let files = $.map(xml.find('Contents'), function (item)
    {
        item = $(item);
        // clang-format off
        return {
            Key: item.find('Key').text(),
            LastModified: item.find('LastModified').text(),
            Size: bytesToHumanReadable(item.find('Size').text()),
            Type: 'file'
        }
        // clang-format on
    });
    if (prefix && files[0] && files[0].Key == prefix)
    {
        files.shift();
    }
    let directories = $.map(xml.find('CommonPrefixes'), function (item)
    {
        item = $(item);
        // clang-format off
        return {
            Key: item.find('Prefix').text(),
            LastModified: '',
            Size: '0',
            Type: 'directory'
        }
        // clang-format on
    });
    let nextMarker = null;
    if ($(xml.find('IsTruncated')[0]).text() == 'true')
    {
        nextMarker = $(xml.find('NextMarker')[0]).text();
    }
    // clang-format off
    return {
        files: files,
        directories: directories,
        prefix: prefix,
        nextMarker: encodeURIComponent(nextMarker)
    }
    // clang-format on
}

// info is object like:
// {
//    files: ..
//    directories: ..
//    prefix: ...
// }
function prepareTable(config, info, bucket_website_url)
{
    let files = info.directories.concat(info.files), prefix = info.prefix;
    let cols = [45, 30, 15];
    let content = [];
    content.push(padRight('Last Modified', cols[1]) + '  ' +
        padRight('Size', cols[2]) + 'Key \n');
    content.push(new Array(cols[0] + cols[1] + cols[2] + 4).join('-') + '\n');

    // add ../ at the start of the dir listing, unless we are already at root dir
    if (prefix && prefix !== config.root_dir)
    {
        let up = prefix.replace(/\/$/, '').replace(/"/g, '&quot;').split('/').slice(0, -1).concat('').join(
            '/'),  // one directory up
            item =
            {
                Key: up,
                LastModified: '',
                Size: '',
                keyText: '../',
                href: '?prefix=' + up + '&host=' + encodePath(config.bucket_name)
            },
            row = renderRow(item, cols);
        content.push(row + '\n');
    }

    jQuery.each(files, function (idx, item)
    {
        // strip off the prefix
        item.keyText = item.Key.substring(prefix.length);
        if (item.Type === 'directory')
        {
            item.href = location.origin + '?prefix=' + encodePath(item.Key) +
                                        '&host=' + encodePath(config.bucket_name);
        } else
        {
            item.href = bucket_website_url + '/' + encodePath(item.Key);
        }
        let row = renderRow(item, cols);
        if (!config.exclude_files.some(function (exclude) { return testExcludeFilter(exclude, item.Key); }))
            content.push(row + '\n');
    });

    return content.join('');
}

// Encode everything but "/" which are significant in paths and to S3
function encodePath(path)
{
    return encodeURIComponent(path).replace(/%2F/g, '/')
}

function renderRow(item, cols)
{
    let row = '';
    row += padRight(item.LastModified, cols[1]) + '  ';
    row += padRight(item.Size, cols[2]);
    row += '<a href="' + item.href + '">' + item.keyText + '</a>';
    return row;
}

function padRight(padString, length)
{
    let str = padString.slice(0, length - 3);
    if (padString.length > str.length)
    {
        str += '...';
    }
    while (str.length < length)
    {
        str = str + ' ';
    }
    return str;
}

function bytesToHumanReadable(sizeInBytes)
{
    let i = -1;
    let units = [' kB', ' MB', ' GB'];
    do
    {
        sizeInBytes = sizeInBytes / 1024;
        i++;
    } while (sizeInBytes > 1024);
    return Math.max(sizeInBytes, 0.1).toFixed(1) + units[i];
}

function testExcludeFilter(filter, key)
{
    if (typeof filter == 'string')
    {
        return key == filter;
    }
    else if (filter instanceof RegExp)
    {
        return filter.test(key);
    }
    else
    {
        throw "exclude filter is not a string or regexp";
    }
}
