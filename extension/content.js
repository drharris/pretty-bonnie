var didit = false;

$(window).on('popstate',function(event) {
    didit = false;
});

$(document).bind("DOMSubtreeModified", function() {
    if(didit) return;
    setTimeout(function() {makeBonniePretty(this);}, 250);
});

window.addEventListener("load", makeBonniePretty, false);

function makeBonniePretty(e) {
    if(didit) return;
    var list = jQuery("<div class='accordion panel-group'></div>");
    if(!document.getElementsByTagName("pre")[1]) {
        didit = false;
        return;
    }
    didit = true; // hopefully
    var test_json = document.getElementsByTagName("pre")[1].textContent;
    var tests = JSON.parse(test_json).tests;
    //var tests = cs6476_json.tests
    for(var test in tests)
    {
        // make panel heading
        var panel = $("<div class='panel'></div>");
        var panelHeading = $("<div data-toggle='collapse' class='panel-heading accordion-toggle collapsed'></div>");
        var panelTitle = $("<h4 class='panel-title'></h4>");
        panelHeading.attr("data-target", "#collapse" + test);
        var panelTitleGlyph = $("<span class='glyphicon' aria-hidden='true'></span>");
        panelTitleGlyph.attr("aria-label", tests[test].output.passfail);
        switch(String(tests[test].output.passfail))
        {
            case "passed":
                panel.addClass("panel-success");
                panelTitleGlyph.addClass("glyphicon-ok-circle");
                break;
            case "failed":
                panel.addClass("panel-danger");
                panelTitleGlyph.addClass("glyphicon-remove-circle");
                break;
            case "partial":
                panel.addClass("panel-warning");
                panelTitleGlyph.addClass("glyphicon-exclamation-sign");
                break;
            default:
                panel.addClass("panel-dark");
                panelTitleGlyph.addClass("glyphicon-question-sign");
                break;
        }
        panelTitle.text(tests[test].description);
        panelTitle.prepend(panelTitleGlyph);
        panelHeading.append(panelTitle);
        panel.append(panelHeading);

        // make panel content
        var collapseDiv = $("<div class='panel-collapse collapse'></div>");
        collapseDiv.attr("id", "collapse"+test);
        var collapseBody = $("<div class='panel-body'></div>");
        var consoles = [];
        var misc = [];
        for(var x in tests[test].output) {
            if(x.endsWith("_console")) consoles.push(x);
        }

        var table = $("<table class='table table-bordered'></table>");
        var thead = $("<thead><tr><th class='col-md-2'><small>Process</small></th><th class='col-md-2'><small>Return Code</small></th><th class='col-md-8'><small>Console</small></th></tr></thead>");
        table.append(thead);
        var tbody = $("<tbody></tbody>");
        table.append(tbody);
        var tracebackOutput = tests[test].traceback;
        var tr = $("<tr></tr>");
        var tdConsole = $("<td></td>");
        var preConsole = $("<pre class='bonnie-console'></pre>")
        preConsole.text(tracebackOutput);
        tdConsole.append(preConsole);
        tr.append($("<th scope='row'>traceback</th>"));
        tr.append($("<td>&nbsp;</td>"));
        tr.append(tdConsole);
        tbody.append(tr);
        for(var x in consoles) {
            var name = consoles[x].replace("_console", "");
            var retCode = tests[test].output[name + "_returncode"];
            var consoleOutput = tests[test].output[consoles[x]];
            var tr = $("<tr></tr>");
            var th = $("<th scope='row'>" + name + "</th>");
            var tdRC = $("<td>" + retCode + "</td>");
            var tdConsole = $("<td></td>");
            var preConsole = $("<pre class='bonnie-console'></pre>")
            preConsole.text(consoleOutput);
            tdConsole.append(preConsole);
            tr.append(th);
            tr.append(tdRC);
            tr.append(tdConsole);
            tbody.append(tr);
        }
        collapseBody.append(table);

        collapseDiv.append(collapseBody);
        panel.append(collapseDiv);
        list.append(panel);
    }
    $(".container").prepend(list);
}