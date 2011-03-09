plugin.loadLang();

if(plugin.enabled)
{
	if(plugin.canChangeMenu())
	{
		plugin.createFileMenu = theWebUI.createFileMenu;
		theWebUI.createFileMenu = function( e, id )
		{
			plugin.createFileMenu.call(this, e, id);
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
				theContextMenu.add( [theUILang.Relocate+"...", "theWebUI.dummy('" + theWebUI.dID + "')"]);
			}
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
				"<label id='lbl_relocate' for='edit_relocate'>" + theUILang.Relocate + ": </label>" +
				"<input type='text' id='edit_relocate' class='TextboxLarge' maxlength='200'/>" +
				"<input type='button' id='btn_relocate_browse' class='Button' value='...' />" +
				"<div class='checkbox'>" +
					"<input type='checkbox' id='relocate_datafiles'/>"+
					"<label for='relocate_datafiles'>"+ theUILang.RelocateMove +"</label>"+
				"</div>" +
			"</fieldset>" +
		"</div>"+
		"<div class='aright buttons-list'>" +
			"<input type='button' value='" + theUILang.ok + "' class='OK Button' id='btn_relocate_ok'" +
				" onclick='theWebUI.sendRelocate(); return(false);' />" +
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