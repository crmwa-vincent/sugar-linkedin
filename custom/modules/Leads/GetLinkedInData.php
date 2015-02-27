<?php
require_once "Zend/Http/Client.php";

class GetLinkedInData
{
    public function doGet(&$bean, $args, $events)
    {
        if (empty($bean->linkedin_id)) {
            $client = new Zend_Http_Client();
            $client->setUri("https://api.linkedin.com/v1/people-search");
            $client->setParameterGet(
                "oauth2_access_token",
                $bean->access_token
            );

            $client->setParameterGet("format", "json");
            $client->setParameterGet("first-name", $bean->first_name);
            $client->setParameterGet("last-name", $bean->last_name);

            $response = $client->request("GET");
            $responseBody = $response->getBody();

            if (empty($responseBody)) {
                return false;
            }

            $responseArray = json_decode($responseBody, true);
            if (!empty($responseArray["numResults"]) && $responseArray["numResults"] != 0) {
                foreach ($responseArray["people"]["values"] as $val) {
                    $bean->linkedin_id = $val["id"];
                }
                $bean->save();
            }
        }
    }
}