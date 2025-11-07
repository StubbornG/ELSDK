<!DOCTYPE html>
<html class="dark">
<head>
    <meta charset="UTF-8">
    <title>{{ name }}</title>
    <link rel="stylesheet" href="/static/normalize.css">
    <!-- inject:css -->
    <!-- endinject -->
<script defer src="http://127.0.0.1:9002/public/dist/dev/js/vendors_398b917c.bundle.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/common_e456e143.bundle.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/entry.dashboard_83da4744.bundle.js"></script></head>
<body>
    <div id="root"></div>
    <input id="projKey" value="{{ projKey }}" style="display: none;"></input>
    <input id="env" value="{{ env }}" style="display: none;"></input>
    <input id="options" value="{{ options }}" style="display: none;"></input>
    <input id="homePage" value="{{ homePage }}" style="display: none;"></input>

</body>
<script>
    try {
        window.projKey = document.getElementById('projKey').value;
        window.env = document.getElementById('env').value;
        const options = document.getElementById('options').value;
        const homePage = document.getElementById('homePage').value;
        console.log(homePage, 'homePage')
        // window.options = JSON.parse(options);
    } catch (e) {
        console.log(e)
    }
</script>
</html>