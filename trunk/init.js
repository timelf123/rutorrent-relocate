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
					theContextMenu.add( [theUILang.Relocate+"...",  (fno==null) ? null : "theWebUI.dummy('" + theWebUI.dID + "','" + fno + "')"] );
				}
				return(true);
			}
			return(false);
		}
	}
	
	theWebUI.dummy = function(dID,fno)
	{
		theDialogManager.show( "dlg_relocate" );
		log(dID);
		log(fno);
		var base_path = $.trim(this.torrents[dID].base_path);
		base_path = base_path + this.files[dID].name
		log(base_path);
	}
	
	theWebUI.submit = function()
	{
		var AjaxReq = jQuery.ajax({
			type: "POST",
			timeout: theWebUI.settings["webui.reqtimeout"],
			async : true,
			cache: false,
			data: "hash="+ hash +"&no="+ no,
			url : "plugins/relocate/action.php"/*,
			success: function(data){
				if (data == '') {
					theDialogManager.hide("dlg_info");
					askYesNo( theUILang.mediaError, theUILang.badMediaData, "" );
					return;
				}
				$("#media_info").html(data);
				theDialogManager.center("dlg_info");
			}*/
		});
	}
	
}

plugin.onLangLoaded = function()
{
	theDialogManager.make( 'dlg_relocate', theUILang.RelocateDlgCaption,
		"<div class='cont fxcaret'>" +
			"<form action='plugins/relocate/action.php' id='frmRelocate' method='post'>"+
				"<fieldset>" +
					"<label id='lbl_relocate' for='relocate'>" + theUILang.Relocate + ": </label>" +
					"<input type='file' name='relocate' id='relocate' class='TextboxLarge' size='42'>"+
				"</fieldset>" +
			"</form>" +
		"</div>"+
		"<div class='aright buttons-list'>" +
			"<input type='button' value='" + theUILang.ok + "' class='OK Button' id='btn_relocate_ok'" +
				" onclick='theWebUI.submit(); return(false);' />" +
			"<input type='button' value='"+ theUILang.Cancel + "' class='Cancel Button'/>" +
		"</div>", true);
}

plugin.onRemove = function()
{
	theDialogManager.hide("dlg_relocate");
}