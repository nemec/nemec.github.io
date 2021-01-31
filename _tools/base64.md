---
layout: default
title: Base64 Encoding and Decoding
---

<h2>Base64 Encoding and Decoding</h2>

<label for="b64-encoded">Base64 Encoded Text:</label>
<textarea id="b64-encoded" rows="13" cols="90">
</textarea>


<label for="b64-decoded">Base64 Decoded Text:</label>
<textarea id="b64-decoded" rows="13" cols="90">
</textarea>

<script type="text/javascript">
    if(document.getElementById('b64-encoded').value !== '') {
        document.getElementById('b64-encoded').value = '';
    }
    if(document.getElementById('b64-decoded').value !== '') {
        document.getElementById('b64-decoded').value = '';
    }
    document.getElementById('b64-encoded')
        .addEventListener("input", (event) => {
            try {
                document.getElementById('b64-decoded').value = atob(event.target.value.trim());
            }
            catch(e) {
                document.getElementById('b64-decoded').value = '<Invalid Base64 formatted text>';
            }
        });
    document.getElementById('b64-decoded')
        .addEventListener("input", (event) => {
            try {
                document.getElementById('b64-encoded').value = btoa(event.target.value.trim());
            }
            catch(e) {
                document.getElementById('b64-encoded').value = '';
            }
        });
</script>