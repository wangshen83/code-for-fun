require([
	"dijit/registry",
	"dojo/parser",
	"dojo/on",
	"dojo/query",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom",
	"dijit/TitlePane",
	"dijit/form/Button",
	"dijit/form/Select",
	"dijit/layout/ContentPane",
	"dijit/Tooltip",
	"dojox/grid/DataGrid",
	"dijit/TooltipDialog",
    "dijit/popup",
	"dojox/validate",
	"dojox/validate/check",
	"dojox/form/Manager",
	"dijit/form/DateTextBox",
	"dojo/domReady!"],
function(registry, parser, on, query, domConstruct, domStyle, lang, arrayUtil, dom, 
		TitlePane, Button, Select, ContentPane, Tooltip, DataGrid, TooltipDialog, popup, validate){
	// parse the page to render the Dojo elements
	parser.parse();
	
	//get the label name by id values
	var getLabelById = function(id, arr){
		for(var i in arr){
			if(arr[i].value === id){
				return arr[i].name;
			}	
		}
		return "";
	};
	
	//register the add button event
	on(dom.byId("addButton"), "click", function(evt){
		domStyle.set(dom.byId("enrolmentList"), "display", "none");
		domStyle.set(dom.byId("hasEnrol"), "display", "block");
    });
	
	//cancel button event
	on(dom.byId("cancelButton"), "click", function(evt){
		domStyle.set(dom.byId("enrolmentList"), "display", "block");
		domStyle.set(dom.byId("hasEnrol"), "display", "none");
    });
	
	//program select
	on(dijit.byId("program"), "change", function(evt){
		programs.forEach(function(program){
			var sel = dijit.byId("program");
		    if(sel.get("value") === program.value){
		    	if(program.isSchoolEnv){
		    		domStyle.set(dom.byId("schoolInfo"), "display", "block");
		    		query("label[for='school']").addClass("required");
		    		dijit.byId("school").required = true;
		    	}else{
		    		domStyle.set(dom.byId("schoolInfo"), "display", "none");
		    		query("label[for='school']").removeClass("required");
		    		dijit.byId("school").required = false;
		    	}
		    	if(program.isYearMandatory){
		    		query("label[for='yearlevel']").addClass("required");
		    		query("label[for='year']").addClass("required");
		    		dijit.byId("yearlevel").required = true;
		    		dijit.byId("year").required = true;
		    	}else{
		    		query("label[for='yearlevel']").removeClass("required");
		    		query("label[for='year']").removeClass("required");
		    		dijit.byId("yearlevel").required = false;
		    		dijit.byId("year").required = false;
		    	}
		    	return;
		    }
		});
	});
	
	var count = 1;

	//apply button event
	on(dom.byId("applyButton"), "click", function(evt){   
		var form = dijit.byId("myForm");
		//validate the form first
		if(!form.validate()) {
		    return;
		}
		
		//widget display
		domStyle.set(dom.byId("enrolmentList"), "display", "block");
		domStyle.set(dom.byId("hasEnrol"), "display", "none");
		domStyle.set(dom.byId("noEnrol"), "display", "none");
		
		//get the form value and format
		var form = registry.byId("myForm");
		var values = form.gatherFormValues();
		console.log(values);
		var programName = getLabelById(values.program, programs);
		var d = values.enrolmentDate;
		var formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
		localStorage.setItem("enrolmentDate", formattedDate);
		var title = programName + "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" + formattedDate + 
					"&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" + "Active";
		var school, yearLevel, year;
		if(values.program === "3"){
			school = "";
			yearLevel = "";
			year = "";
		}else{
			school = values.school;
			yearLevel = values.yearlevel;
			year = values.year;			
		}
		
		//name the widget id
		var applyChangeBtnDivId = "applyChangeDiv_" + count;
		var buttonId = "applyChange_" + count;
		var schoolDivId = "school_" + count;
		var yearLevelDivId = "yearlevel_" + count;
		var yearDivId = "year_" + count;
		var terminateDateDivId = "terminateDate_" + count;
		var terminateStatusDivId = "terminateStatus_" + count;
		var saveBtnId = "saveTerminate_" + count;
		var closeBtnId = "closeTerminate_" + count;
		var logDivId = "schoolLogLink_" + count;
		var confirmBtnId = "confirmButton_" + count;
		
		//terminate template
		var terminateTemplate = `<fieldset><legend>Enrolment Termination</legend><div class="ele">
			    <label class="required" for="terminateDate">Termination Date</label>
		        <input type="text" name="terminateDate" id=${terminateDateDivId} value="now"
					    data-dojo-type="dijit/form/DateTextBox"
					    data-dojo-props="required: true" />
		        </div>
		        <div class="ele">
		            <label class="required" for="terminateStatus">Termination Status</label>
		            <select id=${terminateStatusDivId} name="terminateStatus" style="width: 200px;" data-dojo-type="dijit/form/Select">
					    <option value="1">Withdrawn Consent</option>
					</select>
		        </div><div style="float: right;"><button data-dojo-type="dijit/form/Button" data-dojo-props="'class':'btn-alt'" id=${saveBtnId}>Save</button>
				<button data-dojo-type="dijit/form/Button" data-dojo-props="'class':'btn-alt'" id=${closeBtnId}>Close</button></div></fieldset>`;
		//reactive template
		var reactiveTemplate = `<fieldset><legend>Enrolment Termination</legend><div class="ele"><p>Please click <strong>Confirm</strong> to reactive the enrolment</p></div>
		<div style="float: right;"><button data-dojo-type="dijit/form/Button" data-dojo-props="'class':'btn-alt'" id=${confirmBtnId}>Confirm</button></div></fieldset>`;
		//content pane
		var cp = new ContentPane({
			id: "contentPane_" + count,
			content: ""
		});
		
		//set enrolment content template
		var enrolmentContentTemplate = `<div class="ele">
				<label>Program: </label>
			    ${programName}
			    <div id=${applyChangeBtnDivId} style="float: right;">
			        <button data-dojo-type="dijit/form/Button" data-dojo-props="'class':'btn-alt'" id=${buttonId} name="applyChange" value="applyChange">Apply Change</button>
			    </div>
			</div>
			<div class="ele">
				<label>Enrolment Date: </label>
				${formattedDate}
			</div>`;
		
		cp.set("content", enrolmentContentTemplate);
		
		//if the school is selected, set the content pane content
		if(school){
			let options = [];
			for(var i in schools){
				options.push({
					label: schools[i].name,
					value: schools[i].value,
					selected: schools[i].value === school ? "selected" : ""
				})
			}

			enrolmentContentTemplate += `<div class="ele"><label>School: </label>
					<select id=${schoolDivId} name="school" style="width: 200px;" data-dojo-type="dijit/form/Select">
				        ${options.map(function (val) {
							return "<option value='" + val.value + "' selected = '" + val.selected + "'>" + val.label + "</option>"
						}).join("")}
					</select>&nbsp;&nbsp;<a id=${logDivId} href="#"><i class="fa fa-file-text"></i></a>
			</div>`;
			cp.set("content", enrolmentContentTemplate);
		}
		//if the year level is selected, set the content
		if(yearLevel){
			let yearLevelOptions = [];
			for(var i in yearLevels){
				yearLevelOptions.push({
					label: yearLevels[i].name,
					value: yearLevels[i].value,
					selected: yearLevels[i].value === yearLevel ? "selected" : ""
				})
			}
			enrolmentContentTemplate += `<div class="ele"><label>Year Level: </label>
					<select id=${yearLevelDivId} name="yearlevel" style="width: 200px;" data-dojo-type="dijit/form/Select">
				        ${yearLevelOptions.map(function (val) {
							return "<option value='" + val.value + "' selected = '" + val.selected + "'>" + val.label + "</option>"
						}).join("")}
					</select>
			</div>`;
			cp.set("content", enrolmentContentTemplate);
		}
		//if the year is selected, set the content
		if(year){
			let yearOptions = [];
			for(var i in years){
				yearOptions.push({
					label: years[i].name,
					value: years[i].value,
					selected: years[i].value === year ? "selected" : ""
				})
			}
			enrolmentContentTemplate += `<div class="ele"><label>Year: </label>
					<select id=${yearDivId} name="year" style="width: 200px;" data-dojo-type="dijit/form/Select">
				        ${yearOptions.map(function(val){
							return "<option value='" + val.value + "' selected = '" + val.selected + "'>" + val.label + "</option>"
						}).join("")}
					</select>
			</div>`;
			cp.set("content", enrolmentContentTemplate);
		}
		
		//init the title pane and append to the list
		var tp = new TitlePane({id:"titalPane_" + count, title: title, open: false});
		tp.set("content", cp.domNode);
	    dom.byId("list").appendChild(tp.domNode);
	    
	    //delete button on the title
	    var deleteButton = new Button({
	    	id: "deleteButton_" + count,
            label: 'x',
            //when click the button, show the terminate/reactive dialog
            onClick: function (e) {
	            var btnId = deleteButton.params.id;
	            var num = btnId.split("_")[1];
            	if(deleteButton.get("label") !== "✔"){
	            	deleteButton.set("label", "-");
		            tp.set("open", false);
		            console.log(query('#tooltipDialog_' + num))
		            if(query('#tooltipDialog_' + num).length === 0){
		            	new TooltipDialog({
			                id: 'tooltipDialog_' + num,
			                style: "width: 450px;",
			                content: terminateTemplate
			            });
		            }
		            popup.open({
		                popup: dijit.byId('tooltipDialog_' + num),
		                around: this.domNode
		            });
		            
		            //when clicking the save button on the terminate dialog
		    	    on(dijit.byId('saveTerminate_' + num), "click", function(evt){
		    	    	var titlePane = dijit.byId("titalPane_" + num);
		    	    	var schoolTitle = titlePane.get("title").split("&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;")[0];
		    	    	var teminateDate = dijit.byId("terminateDate_" + num).get("value");
		    	    	var formattedTeminateDate = `${teminateDate.getDate()}/${teminateDate.getMonth() + 1}/${teminateDate.getFullYear()}`;
		    	    	titlePane.set("title", `${schoolTitle}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${formattedTeminateDate}
		    	    	&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Terminated`);
		    	    	deleteButton.set("label", "✔");
		    	    	popup.close(dijit.byId('tooltipDialog_' + num));
		    	    	
		    	    	if(dijit.byId("school_" + num))
		    	    		dijit.byId("school_" + num).set('disabled', true);
		    	    	if(dijit.byId("yearlevel_" + num))
		    	    		dijit.byId("yearlevel_" + num).set('disabled', true);
		    	    	if(dijit.byId("year_" + num))
		    	    		dijit.byId("year_" + num).set('disabled', true);
		    	    	domStyle.set(dom.byId("applyChangeDiv_" + num), 'display', 'none');
		    	    	dijit.byId("delTip_" + num).set("label", "Reactive this enrolment");
		    	    });
		    	    
		    	    on(dijit.byId("closeTerminate_" + num), "click", function(evt){
		    	    	popup.close(dijit.byId('tooltipDialog_' + num));
		    	    	deleteButton.set("label", "x");
		    	    });
            	}else{
            		dijit.byId("delTip_" + num).set("label", "Reactive this enrolment");
            		tp.set("open", false);
            		if(query('#tooltipReactiveDialog_' + num).length === 0){
		            	new TooltipDialog({
			                id: 'tooltipReactiveDialog_' + num,
			                style: "width: 350px;",
			                content: reactiveTemplate
			            });
		            }
		            popup.open({
		                popup: dijit.byId('tooltipReactiveDialog_' + num),
		                around: this.domNode
		            });
		            
		            //when clicking the confirm button on the reactive dialog
		    	    on(dijit.byId('confirmButton_' + num), "click", function(evt){
		    	    	var titlePane = dijit.byId("titalPane_" + num);
		    	    	var schoolTitle = titlePane.get("title").split("&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;")[0];
		    	    	var enrolmentDate = localStorage.getItem("enrolmentDate");
		    	    	titlePane.set("title", `${schoolTitle}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
		    	    	${enrolmentDate}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Active`);
		    	    	deleteButton.set("label", "x");
		    	    	popup.close(dijit.byId('tooltipReactiveDialog_' + num));
		    	    	
		    	    	if(dijit.byId("school_" + num))
		    	    		dijit.byId("school_" + num).set('disabled', false);
		    	    	if(dijit.byId("yearlevel_" + num))
		    	    		dijit.byId("yearlevel_" + num).set('disabled', false);
		    	    	if(dijit.byId("year_" + num))
		    	    		dijit.byId("year_" + num).set('disabled', false);
		    	    	domStyle.set(dom.byId("applyChangeDiv_" + num), 'display', 'block');
		    	    	dijit.byId("delTip_" + num).set("label", "Terminate this enrolment");
		    	    });
            	}
            }
        });
        deleteButton.placeAt(tp.focusNode);
	    tp.startup();
	    
	    new Tooltip({
	    	id: "delTip_" + count,
	        connectId: [query("#deleteButton_" + count)],
	        label: "Terminate this enrolment"
	    });
	    var schoolName = getLabelById(school, schools);
	    var yearLevelName = getLabelById(yearLevel, yearLevels);
	    var yearName = getLabelById(year, years);
	    
	    //enrolment log tip
	    var tooltipContent = `<table>
		    <tr style="background: #007ac2;">
		      <th field="school" width="150px">School</th>
		      <th field="yearlevel" width="150px">Year Level</th>
		      <th field="year" width="150px">Year</th>
		    </tr>
		  	<tr>
		      <td field="school" align="center">${schoolName}</td>
		      <td field="yearlevel" align="center">${yearLevelName}</td>
		      <td field="year" align="center">${yearName}</td>
		    </tr>
		</table>`;
	    
		var schoolLogLink = query("#schoolLogLink_" + count);
		var tip = new Tooltip({
	        connectId: [schoolLogLink],
	        label: tooltipContent
	    });
		
		//click event for the apply change button
	    on(query("#applyChange_" + count), "click", function(evt){
	    	var targetId = evt.target.id;
	    	var num = targetId.split("_")[1];
	    	if(num){
	    		var schoolName = query("#school_" + num)[0].innerText;
	    		var yearlevelName = "";
	    		var yearName = "";
	    		if(query("#yearlevel_" + num)[0])
	    			yearlevelName = query("#yearlevel_" + num)[0].innerText;
	    		if(query("#year_" + num)[0])
	    			yearName = query("#year_" + num)[0].innerText;
	    		tooltipContent += `<table><tr>
				      <td field="school" width="150px" align="center">${schoolName}</td>
				      <td field="yearlevel" width="150px" align="center">${yearlevelName}</td>
				      <td field="year" width="150px" align="center">${yearName}</td>
				    </tr></table>`;
	    		tip.set("label", tooltipContent);
	    		alert("Changes applied, please see the school enrolment log!")
	    	}
	    });
	    
	    count++;
    });
});