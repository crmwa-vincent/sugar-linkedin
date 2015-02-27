<?php
require_once "modules/Leads/views/view.detail.php";

class CustomLeadsViewDetail extends LeadsViewDetail
{
    function display()
    {
        global $sugar_config;
        $disableConvert = ($this->bean->status == 'Converted' && !empty($sugar_config['disable_convert_lead'])) ? TRUE : FALSE;
        $this->ss->assign("DISABLE_CONVERT_ACTION", $disableConvert);

        echo '<script type="text/javascript" src="custom/modules/Leads/LinkedInConnections.js"></script>';
        echo '<div id="linkedinData" style="display: none"></div>';
        parent::display();
    }

}