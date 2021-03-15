---
layout: default
title: List AWS Bucket Contents
---

<h2>List AWS Bucket Contents</h2>

<input id="bucket-name" type="text" placeholder="Enter Bucket Name" />
<button id="load-button">Load</button>
<div id="listing"></div> 

<script src="/js/jquery.1.9.0.min.js"></script>

<script src="/js/aws-bucket-list.js"></script>
<script>
    $('#load-button').on('click', b => {
        let bucket_name = $("#bucket-name").val();
        if(bucket_name.trim() !== '') {
            getS3Data({
                bucket_name
            });
        }
    });
    let rx = '.*[?&]host=([^&]+)(&.*)?$';
    let match = location.search.match(rx);
    if (match) {
        let bucket_name = match[1];
        $("#bucket-name").val(bucket_name);
        getS3Data({
            bucket_name
        });
    }
</script>