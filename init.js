plugin.loadLang();

if(plugin.enabled)
{
	if(plugin.canChangeMenu())
	{
		plugin.createFileMenu = theWebUI.createFileMenu;
		theWebUI.createFileMenu = function( e, id ) 
		{
			if(plugin.createFileMenu.call(this, e, id)) 
			{
				if(plugin.enabled) 
				{
					theContextMenu.add([CMENU_SEP]);
					var fno = null;
					var table = this.getTable("fls");
					if((table.selCount == 1)  && (theWebUI.dID.length==40))
					{
						var fid = table.getFirstSelected();
						if(this.settings["webui.fls.view"])
						{
							var arr = fid.split('_f_');
							fno = arr[1];
						}
						else
						if(!this.dirs[this.dID].isDirectory(fid))
							fno = fid.substr(3);
					}
					theContextMenu.add( [theUILang.Relocate+"...",  (fno==null) ? null : "theWebUI.dummy('" + theWebUI.dID + "')"] );
				}
				return(true);
			}
			return(false);
		}
	}
	
	theWebUI.dummy = function(dID)
	{
		theDialogManager.show( "dlg_relocate" );
		log(theWebUI.dID);
	}
	
}

plugin.onLangLoaded = function()
{
	theDialogManager.make( 'dlg_relocate', theUILang.RelocateDlgCaption,
		"<div class='cont fxcaret'>" +
			"<fieldset>" +
				"<label id='lbl_relocate' for='relocate'>" + theUILang.Relocate + ": </label>" +
				"<input type='file' name='relocate' id='relocate' class='TextboxLarge' size='42'>"+
				"<!--<input type='button' id='btn_relocate_browse' class='Button' value='...' />-->" +
			"</fieldset>" +
		"</div>"+
		"<div class='aright buttons-list'>" +
			"<input type='button' value='" + theUILang.ok + "' class='OK Button' id='btn_relocate_ok'" +
				" onclick='theWebUI.sendRelocate(); return(false);' />" +
			"<input type='button' value='"+ theUILang.Cancel + "' class='Cancel Button'/>" +
		"</div>", true);
}

plugin.onRemove = function()
{
	theDialogManager.hide("dlg_relocate");
}