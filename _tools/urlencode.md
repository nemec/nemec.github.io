---
layout: default
title: URL Encoding and Decoding
---

<h2>URL Encoding and Decoding</h2>

<label for="url-encoded">URL Encoded Text:</label>
<textarea id="url-encoded" rows="13" cols="90">
</textarea>


<label for="url-decoded">URL Decoded Text:</label>
<textarea id="url-decoded" rows="13" cols="90">
</textarea>

<script type="text/javascript">
    if(document.getElementById('url-encoded').value !== '') {
        document.getElementById('url-encoded').value = '';
    }
    if(document.getElementById('url-decoded').value !== '') {
        document.getElementById('url-decoded').value = '';
    }
    document.getElementById('url-encoded')
        .addEventListener("input", (event) => {
            try {
                document.getElementById('url-decoded').value = decodeURIComponent(event.target.value.trim());
            }
            catch(e) {
                document.getElementById('url-decoded').value = '<Invalid URL encoded text>';
            }
        });
    document.getElementById('url-decoded')
        .addEventListener("input", (event) => {
            try {
                document.getElementById('url-encoded').value = encodeURIComponent(event.target.value.trim());
            }
            catch(e) {
                document.getElementById('url-encoded').value = '';
            }
        });
</script>