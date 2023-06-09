console.log("基础css样式----");

$("head").append(
  $(`<style>
  body {
    padding: 0px;
    position: relative;
  }
  label {
    margin-bottom: 0;
  }
  p {
    margin: 0;
  }
</style>`)
);
