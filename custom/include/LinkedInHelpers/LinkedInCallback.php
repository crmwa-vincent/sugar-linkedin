<?php
require_once "Zend/Http/Client.php";

class LinkedInCallback
{
    private $uri = "https://www.linkedin.com/uas/oauth2/accessToken";

    private $clientId = "";
    private $clientSecret = "";
    private $redirectUri = "http://sugar-linkedin.dev/index.php?entryPoint=linkedInCallback";
    private $grantType = "authorization_code";

    public $authCode;


    public function __construct(array $requestData)
    {
        global $sugar_config;

        $this->clientId = $sugar_config['linkedInCreds']["client_id"];
        $this->clientSecret = $sugar_config['linkedInCreds']["client_secret"];

        if (!empty($requestData["code"])) {
            $this->authCode = $this->exchangeAuthcodeForRequestToken($requestData["code"]);
        }
    }

    public function exchangeAuthcodeForRequestToken($authCode)
    {
        $responseBody = "{}";
        $client = new Zend_Http_Client();
        $client->setUri($this->uri);
        $client->setHeaders("Content-Type", "application/x-www-form-urlencoded");
        $client->setParameterPost("grant_type", $this->grantType);
        $client->setParameterPost("code", $authCode);
        $client->setParameterPost("redirect_uri", $this->redirectUri);
        $client->setParameterPost("client_id", $this->clientId);
        $client->setParameterPost("client_secret", $this->clientSecret);

        $response = $client->request("POST");
        $responseBody = $response->getBody();

        if (empty($responseBody)) {
            return false;
        }

        return json_decode($responseBody);
    }
}

$callback = new LinkedInCallback($_REQUEST);
$_SESSION["linkedInAuthCode"] = $callback->authCode;
echo "<pre>";
print_r($_SESSION["linkedInAuthCode"]);
