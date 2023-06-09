$("body").append(
  $(`
  <div id="myPlugin"></div>
`)
);

// 提示框
function LDYPrompt(val, type) {
  let LDYvalue = val || "";
  let LDYtype = type || "primary";
  if ((LDYtype = "primary")) {
    $("#myPlugin").append(
      $(`
        <div id="my-prompt" class="alert alert-primary" role="alert">
          ${LDYvalue}
        </div>
      `)
    );
  }
  if ((LDYtype = "success")) {
    $("#myPlugin").append(
      $(`
        <div id="my-prompt" class="alert alert-primary" role="alert">
          ${LDYvalue}
        </div>
      `)
    );
  }
  if ((LDYtype = "error")) {
    $("#myPlugin").append(
      $(`
        <div id="my-prompt" class="alert alert-danger" role="alert">
          ${LDYvalue}
        </div>
      `)
    );
  }
}
