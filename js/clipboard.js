// https://stackoverflow.com/a/30810322/564755
function fallbackCopyTextToClipboard(text)
{
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try
    {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
        return Promise.resolve(msg);
    } catch (err)
    {
        console.error('Fallback: Oops, unable to copy', err);
        return Promise.reject(err)
    }
    finally {
        document.body.removeChild(textArea);
    }
}
function copyTextToClipboard(text)
{
    if (!navigator.clipboard)
    {
        return fallbackCopyTextToClipboard(text);
    }
    return navigator.clipboard.writeText(text).then(function ()
    {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err)
    {
        console.error('Async: Could not copy text: ', err);
    });
}