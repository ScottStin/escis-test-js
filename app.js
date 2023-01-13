//--------------------------------
// -------------- INIT -----------
//--------------------------------

var actionLevelArray = [];
var displayActionLevelArray = [];
var alpOrderGroups = true
var alpORderChemNames = true
var sortButton="&#8613;"

//--------------------------------
// ------- ADD ACTION TABLE ------
//--------------------------------

const dispalyTable = document.createElement('table');
dispalyTable.setAttribute('class','table table-hover');
dispalyTable.setAttribute('id','dispalyTable');
document.querySelector('#mainTable').appendChild(dispalyTable);

const createActionLevelTable = async () =>{
    this.actionLevelArray = await axios.get("https://staging.esdat.net/EnvironmentalStandards/GetAllGlobalActionLevelSources")
    this.actionLevelArray.data = this.actionLevelArray.data.sort((a,b)=>`${a.Group?.ParentGroup?.ParentGroup?.Name} -> ${a.Group?.ParentGroup?.Name} -> ${a.Group?.Name}`.localeCompare(`${b.Group?.ParentGroup?.ParentGroup?.Name} -> ${b.Group?.ParentGroup?.Name} -> ${b.Group?.Name}`) );
    this.displayActionLevelArray.data = [...actionLevelArray.data];
    renderMainTable(this.displayActionLevelArray.data);
}
createActionLevelTable();

//--------------------------------
// -------- ADD ENVIRO TABLE -----
//--------------------------------

const enviroStandardsTable = document.createElement('table');
enviroStandardsTable.setAttribute('class','table table-bordered');
document.getElementById('modalBody').appendChild(enviroStandardsTable);
let th = enviroStandardsTable.createTHead();
tr = th.insertRow();    
['<b>Chem Name</b>','<b>Chem Code</b>','<b>Action Level</b>'].forEach((header)=>{
    td = tr.insertCell();
    td.innerHTML = header;
});

//--------------------------------
// -- RENDER ACTION TABLE DATA ---
//--------------------------------

const renderMainTable = (array)=>{
    tr = dispalyTable.insertRow();
    td = tr.insertCell();
    td.innerHTML = '<a style="text-decoration: none; cursor:pointer" onClick="sortGroups()">'+this.sortButton+'</a> <b>Group</b>';
    td = tr.insertCell();
    td.innerHTML = '<b>Action Level Source</b>';

    array.forEach((row)=>{
        let tr = dispalyTable.insertRow();
        tr.setAttribute("onclick", "showEnviroStandards('"+row.ActionLevelSource+"')");
        let td = tr.insertCell();
        td.innerText = `${row.Group?.ParentGroup?.ParentGroup?.Name} -> ${row.Group?.ParentGroup?.Name} -> ${row.Group?.Name}`;
        td = tr.insertCell();
        td.innerText = row.ActionLevelSource;
        td.style.cursor ='pointer';
    })
}

//--------------------------------
// --- RENDER ENVIRO TABLE DATA --
//--------------------------------

var showEnviroStandards = async (actionLevelSoure)=>{
    const enviroStandardsArray = await axios.get(`https://staging.esdat.net/EnvironmentalStandards/GetGlobalEnvironmentalStandards?actionLevelSource=${actionLevelSoure}`);
    enviroStandardsArray.data = enviroStandardsArray.data.sort((a,b)=>a.ChemName.localeCompare(b.ChemName));
    $('#enviroModal').modal('show');
    modalTitle.innerHTML = actionLevelSoure;    

    enviroStandardsArray.data.forEach((row)=>{
        let tr = enviroStandardsTable.insertRow();
        ['ChemName','ChemCode','ActionLevelDisplayText'].forEach((cell)=>{
            td = tr.insertCell();
            td.innerHTML = row[cell];
        })
    });
}

//--------------------------------
// ----- SEARCH ACTION GROUPS ----
//--------------------------------

const searchGroups = (event) =>{
    displayActionLevelArray.data = this.actionLevelArray.data.filter(obj=>{
        return obj.Group?.Name?.toLowerCase().includes(event.toLowerCase()) || obj.ActionLevelSource.toLowerCase().includes(event.toLowerCase());
    });    
    document.getElementById('dispalyTable').innerHTML = '';
    renderMainTable(this.displayActionLevelArray.data);
}

//--------------------------------
// ----- SORT ACTION GROUPS ------
//--------------------------------

const sortGroups= ()=>{
    if(this.alpOrderGroups ===  true){
        this.displayActionLevelArray.data.sort((b,a)=>`${a.Group?.ParentGroup?.ParentGroup?.Name} -> ${a.Group?.ParentGroup?.Name} -> ${a.Group?.Name}`.localeCompare(`${b.Group?.ParentGroup?.ParentGroup?.Name} -> ${b.Group?.ParentGroup?.Name} -> ${b.Group?.Name}`) );
        this.sortButton = "&#8615"        
    } else{
        this.displayActionLevelArray.data.sort((a,b)=>`${a.Group?.ParentGroup?.ParentGroup?.Name} -> ${a.Group?.ParentGroup?.Name} -> ${a.Group?.Name}`.localeCompare(`${b.Group?.ParentGroup?.ParentGroup?.Name} -> ${b.Group?.ParentGroup?.Name} -> ${b.Group?.Name}`) );
        this.sortButton = "&#8613"
    }
    this.alpOrderGroups = !this.alpOrderGroups
    document.getElementById('dispalyTable').innerHTML = '';
    renderMainTable(this.displayActionLevelArray.data); 
}