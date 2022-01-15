---
layout: post
title: An OSINT Perspective on Hashing
description: Some description
category: infosec
tags:
  - osint
headerImage: 2020/05/port-scan-header.png
headerImageAttrib: image credit - bitninja.io
#editNotes:
#  - Edited 2021-01-01 for clarity
---

* basic overview of its use
* collecting evidence
* passwords
* threat intel - malware
* file integrity
* other kinds of hashing (buckets, strlen) - crypto vs non crypto
  * Group by birth month
* cracking
  * dictionary attacks
  * patterns
* broken hashing (MD5)
* software for hashing
  * hunchly
  * md5sum/sha1sum
  * others?
* lack of search space (e.g. phone nums, SSN)
* hashing vs encryption
* admissability as evidence
  * hash collision stats


https://ir.lawnet.fordham.edu/cgi/viewcontent.cgi?article=1855&context=faculty_scholarship
"A  hash  value  is  a  number  that  is  often represented  as  a  sequence  of  characters  and  is produced by an algorithm based upon the digital contents of a drive, medium, or file. If the hash values for the original and copy are different, then the copy is not identical to the  original.  If  the  hash  values  for  the  original  and  copy  are  the  same,  it  is  highly improbable that the original and copy are not identical. Thus, identical hash values for the  original  and  copy  reliably  attest  to  the  fact  that  they  are  exact  duplicates.  This amendment  allows  self-authentication  by  a  certification  of  a  qualified  person  that  she checked  the  hash  value  of  the  proffered  item  and  that  it  was  identical  to  the  original."


https://www.sans.org/blog/law-is-not-a-science-admissibility-of-computer-evidence-and-md5-hashes/
"Will hashing help admissibility of my evidence? Certainly, but it is not legally required."

"If hashing is not legally required to prove authenticity, why do we use hashing, chain of custody, and proper storage of evidence in case of pending litigation? Two point five reasons:
1. Expert Witness: Best practices are tested if you are deposed as an expert. Hashing (any form) is considered a best practice for digital forensic practitioners.
2. Tampering: With hashing (even using an algorithm such as MD5), you can reduce the threat that someone will claim the evidence has been tampered with if you can prove over time it has not changed.
2.5. Law Is Not A Science:
"


http://www.lex-informatica.org/2%20Ensuring%20the%20Legality%20of%20the%20Digital%20Forensics%20Process%20in%20South%20Africa.pdf
* THE USE OF CRYPTOGRAPHIC HASH FUNCTIONS WITHIN DIGITAL FORENSICS
  * Identification of Known Files
  * Ensure Complete Forensic Images are Made
  * Ensure the Integrity of Evidential Data to Ensure no Data has been Altered

https://www.americanbar.org/groups/litigation/committees/trial-evidence/practice/2018/new-rules-electronic-evidence/


----------------------------------------------

Secure hashing is a complicated beast. 

Today we're going to be talking about Hashing and how to applies to OSINT
investigations. What is it, and can we trust it for collecting evidence? Where
else could you see hashes while investigating? We'll see that certain hash types
are regarded as "secure" today 

Known as a trapdoor - can convert from content to a hash, but you cannot convert
back to the content given only the hash.


## Cracking Under Pressure

Up until now we've discussed hashing in terms of the perfect cryptographic hash
function - unbreakable, uncrackable. Unfortunately, in the real world it's not
that simple. There are hashes that are fundamentally insecure, which have real-
world uses (just not for security), and then there are hashes that were once
secure, but due to advances in computer speed or weaknesses in the algorithm,
are now considered insecure and unusable for any security context.