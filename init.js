plugin.loadLang();

theWebUI.tables.relocate = 
{
	obj: new dxSTable(),
	columns:
	[
		{ text: theUILang.Name, 			width: "300px",	id: "name",			type: TYPE_STRING },
		{ text: theUILang.Relocate, 		width: "300px",	id: "relocate",		type: TYPE_STRING }
	],
	container:	"RelocateFileList",
	format:		theFormatter.files,
	onselect:	function(e,id) { theWebUI.flsSelect(e,id) }/*,
	ondblclick:	function(obj) 
	{
		if(!theWebUI.settings["webui.fls.view"] && (theWebUI.dID!=""))
		{
			var lnk = this.getAttr(obj.id, "link");
					if(lnk!=null)
					{
						theWebUI.dirs[theWebUI.dID].setDirectory(lnk);
				this.clearRows();
					theWebUI.redrawFilesRelocate(theWebUI.dID);
			}
		}
		return(false);
	}*/
}

theWebUI.redrawFilesRelocate = function(hash) 
{
	if(this.dID == hash) 
		{
			var table = this.getTable("relocate");
			for(var i in this.files[hash]) 
			{
				var sId = hash + "_f_" + i;
				var file = this.files[hash][i];
				file.percent = (file.size > 0) ? theConverter.round((file.done/file.size)*100,1): "100.0";
				if(this.settings["webui.fls.view"])
				{
				if(!$type(table.rowdata[sId])) 
							table.addRowById(file, sId, file.icon, file.attr);
						else
						{
							for(var j in file) 
								table.setValueById(sId, j, file[j]);
					table.setIcon(sId,file.icon);
					table.setAttr(sId,file.attr);
				}
			}
			else
			{
				if(!$type(this.dirs[hash]))
					this.dirs[hash] = new rDirectory();
				this.dirs[hash].addFile(file, i);
			}
		}
		if(!this.settings["webui.fls.view"] && this.dirs[hash])
		{
			var dir = this.dirs[hash].getDirectory();
			for(var i in dir) 
			{
				var entry = dir[i];
				if(entry.link!=null)
				{
					if(!$type(table.rowdata[i])) 
							table.addRowById(entry.data, i, entry.icon, {link : entry.link});
					else
								for(var j in entry.data) 
									table.setValueById(i, j, entry.data[j]);
				}
			}
			for(var i in dir) 
			{
				var entry = dir[i];
				if(entry.link==null)
				{
					if(!$type(table.rowdata[i])) 
							table.addRowById(entry.data, i, entry.icon, {link : null});
					else
								for(var j in entry.data) 
									table.setValueById(i, j, entry.data[j]);
				}
			}
		}
		table.Sort();
		}
}

theWebUI.getFilesRelocate= function(hash, isUpdate) 
{
	var table = this.getTable("relocate");
	if(!isUpdate)
	{
			table.dBody.scrollTop = 0;
			$(table.tpad).height(0);
			$(table.bpad).height(0);
			table.clearRows();
		}
	if($type(this.files[hash]) && !isUpdate) 
			this.redrawFilesRelocate(hash);
	else 
	{
			if(!$type(this.files[hash]))
				this.files[hash] = new Array(0);
			this.request("?action=getfiles&hash=" + hash, [this.addFiles, this]);
		}
}

if(plugin.enabled)
{
	if(plugin.canChangeMenu())
	{
		plugin.createMenu = theWebUI.createMenu;
		theWebUI.createMenu = function( e, id )
		{
			plugin.createMenu.call(this, e, id);
			if(plugin.enabled)
			{
				
				//var table = this.getTable("relocate");
				var el = theContextMenu.get( theUILang.Properties );
				if( el )
					theContextMenu.add([CMENU_SEP]);
					theContextMenu.add( el, [theUILang.Relocate+"...", "theWebUI.dummy('" + theWebUI.dID + "')"]);
						//theDialogManager.show( "dlg_relocate" );
						//theWebUI.redrawFilesRelocate.call(this,theWebUI.dID);
			}
		}
	}
	
	theWebUI.dummy = function(dID)
	{
		theDialogManager.show( "dlg_relocate" );
		theWebUI.getFilesRelocate.call(this, theWebUI.dID);
	}
	
}

plugin.onLangLoaded = function()
{
	theDialogManager.make( 'dlg_relocate', theUILang.relocateDlgCaption,
		"<div class='cont fxcaret'>" +
			"<fieldset>" +
				"<div id='RelocateFileList' class='table_tab'>" +
				"</div>" +
			"</fieldset>" +
		"</div>"+
		"<div class='aright buttons-list'>" +
			"<input type='button' value='" + theUILang.ok + "' class='OK Button' id='btn_relocate_ok'" +
				" onclick='theWebUI.sendrelocate(); return(false);' />" +
			"<input type='button' value='"+ theUILang.Cancel + "' class='Cancel Button'/>" +
		"</div>", true);
	if(thePlugins.isInstalled("_getdir"))
	{
		var btn = new theWebUI.rDirBrowser( 'dlg_relocate', 'edit_relocate', 'btn_relocate_browse', 'frame_relocate_browse' );
		theDialogManager.setHandler('dlg_relocate','afterHide',function()
		{
			btn.hide();
		});
	}
	else
		$('#btn_relocate_browse').remove();
}

plugin.onRemove = function()
{
	theDialogManager.hide("dlg_relocate");
}