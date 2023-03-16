---
layout: post
title: Referencing contacts in your Trilium Notes
description: How to tag people in your notes and keep track of your conversations
category: programming
tags:
  - trilium
  - productivity
headerImage: 2023/03/trilium-notes-contact-header.jpg
headerImageAttrib: Photo by [Paico Oficial](https://unsplash.com/@paicooficial?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/7jFMs5vzsSQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
  
#editNotes:
#  - Edited 2021-01-01 for clarity
---

The [Trilium](https://github.com/zadam/trilium) project describes itself as a
"personal knowledge base" for taking notes in a similar vein to applications
like Obsidian, OneNote, Joplin, Cherry Tree, etc. I've been using it for a few
years for both personal use and occasional note taking at work. Some of my
favorite features are its cross platform support for Windows/Mac/Linux (and
self-hosted webserver), support for hierarchal notes, WYSIWYG editor,
and REST API/scripting.

Recently I've been playing with a template that lets me tag "contacts" in a
note to remind me of conversations, decisions, or work that I need to do
for someone. The Contact note contains their name and email, among other things,
to help remind me of the specific person. In this post I will demonstrate how to
set up the template for contacts, import contacts from Google Contacts, and
reference the contacts in other notes.

Note: the goal is not to manage your contacts through Trilium (there are better
applications for that), it's just to make it easy to tag people in notes for
reference purposes.

## Setup

This how-to assumes you already have Trilium installed, either as a Desktop
application or on a Server. If you don't, follow the instructions
[here](https://github.com/zadam/trilium/wiki#choose-the-setup) (Desktop is the
easier option). Note that if you use the Desktop version, it must be running to
interact with the API and update your contact data.

### Export your Contacts

Open <https://contacts.google.com/>. Select the contacts that you want to export
(unless you want to export all of them), then choose "Export" from the left-hand
menu.

![Screenshot of the Google Contacts Export button position](/images/2023/03/google-contacts-export-button.png)

Now choose whether to export "Selected Contacts", all "Contacts", or contacts
tagged with a specific label. Export as "Google CSV" - the others will work
as well, but are in a different format than the import script below will accept.

![Screenshot of the Google Contacts Export button form](/images/2023/03/google-contacts-export-form.png)


### Setup Trilium template

Inside Trilium, create a new child note somewhere in your tree (I'd recommend
under the `root` node) named "Contacts". I changed the icon for the note to the
`contact` icon, too. Next, create a child note underneath "Contacts" named
"Implementation". This is the convention used for sub-notes that manage scripts
or templates for other notes. Within that "Implementation" note, create another
note named "Contacts Template". Give this note an icon that reminds you of a
person (`body`, `female`, or `male` are good options) - this will show up
next to any references to this contact in other notes to identify that it's a
link to a person.

Next, click on the "Owned Attributes" button for the "Contacts Template" note.

![Screenshot showing the position of the owned attributes button](/images/2023/03/trilium-owned-attributes-button.png)

Within the text box that appears (it should already display an iconClass
attribute if you chose an icon), add the following text to the end:

```
#label:name=promoted,text #label:email=promoted,text #contact
```

Then press "Enter" or click on the Save button within that text box to save
changes. There will be a new button on the note that appears named "Promoted
attributes". Clicking on it will show text boxes with space to put a name and
email address, but we will be doing this automatically with a script.

Now go back to the "Contacts" note and click on its "Owned attributes" button.
Inside its attributes, type the following. You must type it, not copy-paste it,
because Trilium will need to auto-complete the reference to the template note.

```
~child:template=@Contacts Template
```

Example:

![Screenshot showing the position of the owned attributes button](/images/2023/03/trilium-link-contacts-template.png)

Once you save the changes, any new child notes created beneath the "Contacts"
note will automatically inherit the properties of the template - i.e. the fields
for name and email.


### Get an API key

Click on the main menu in Trilium and choose "Options". There will be a tab
named "ETAPI" - click on that.

![Screenshot of Trilium ETAPI config](/images/2023/03/trilium-etapi-config.png)

Choose to create a new ETAPI token. You can name it whatever you want, such as
`contact-list-import`. Copy the token that's shown next someplace safe (such
as a password manager).


### Setup Import Script

```shell
python3 -m venv env
source env/bin/activate
pip install requests
touch import_contacts_to_trilium.py
```

Copy the `contacts.csv` file downloaded from Google into this directory as well.
Now open the Python file in your favorite text editor/IDE. Inside paste the
following code.

```python
import csv
from dataclasses import dataclass
import pathlib
import requests
import sys

from requests.packages import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

contact_file = pathlib.Path('contacts.csv')
# If you're running the Electron desktop client, this should be
# http://localhost:37840. If you're using the server version, use the base URL
# of your server.
trilium_base_url = 'http://localhost:37840'
trilium_api_key = '<insert api key here>'

# These are the headers in the CSV file containing the data we will import into
# Trilium
name_header_label = 'Name'
email_header_label = 'E-mail 1 - Value'

# Change this if you named the note something else
contacts_root_note_title = 'Contacts'

@dataclass
class ContactAttribute:
    label: str
    value: str
    found: bool = False

s = requests.Session()

def make_search_call(path: str, params: dict):
    resp = s.get(f'{trilium_base_url}/etapi/{path}', headers={
        'Authorization': trilium_api_key
    }, params=params, verify=False)
    resp.raise_for_status()
    return resp.json()

def make_post_call(path: str, body: dict):
    resp = s.post(f'{trilium_base_url}/etapi/{path}', headers={
        'Authorization': trilium_api_key
    }, json=body, verify=False)
    resp.raise_for_status()
    return resp.json()

def make_patch_call(path: str, body: dict):
    resp = s.path(f'{trilium_base_url}/etapi/{path}', headers={
        'Authorization': trilium_api_key
    }, json=body, verify=False)
    resp.raise_for_status()
    return resp.json()

with open(contact_file, 'r') as csv_f:
    contacts_root_note = make_search_call('notes', {
        'search': 'note.title=' + contacts_root_note_title,
        'fastSearch': 'true'
    })
    if len(contacts_root_note['results']) == 0:
        print('Could not find root contact note')
        sys.exit(1)
    elif len(contacts_root_note['results']) > 1:
        print('More than one note named "Contacts" - please name it something unique and then update the variable `contacts_root_note_title`')
        sys.exit(1)
    contacts_root_id = contacts_root_note['results'][0]['noteId']
    existing_contacts = {}

    contacts_notes = make_search_call('notes', {
        'search': f'note.parents.noteId={contacts_root_id}',
        'fastSearch': 'true'
    })
    for result in contacts_notes.get('results'):
        # Skip the implementation note because it isn't a contact
        if result['title'] != 'Implementation':
            existing_contacts[result['title']] = result

    reader = csv.reader(csv_f)

    headers = next(reader)
    name_header_idx = headers.index(name_header_label)
    email_header_idx = headers.index(email_header_label)

    for row in reader:
        title = row[name_header_idx]
        contact_attributes = {
            'name': ContactAttribute(label='name', value=title),
            'email': ContactAttribute(label='email', value=row[email_header_idx])
        }
        if title not in existing_contacts:
            print(f'Adding Contact: {" / ".join(a.value for a in contact_attributes.values())}')
            resp = make_post_call('create-note', {
                'parentNoteId': contacts_root_id,
                'title': title,
                'type': 'text',
                'content': ''
            })
            note = resp['note']
        else:
            print(f'Updating Contact: {" / ".join(a.value for a in contact_attributes.values())}')
            note = existing_contacts[title]

        for attribute in note.get('attributes'):
            if attribute['type'] == 'label':
                contact_attribute = contact_attributes.get(attribute['name'])
                # Has it changed?
                if contact_attribute is not None:
                    contact_attribute.found = True
                    if contact_attribute.value != attribute['value']:
                        print(f'Updating field {contact_attribute.label}={contact_attribute.value}')

                        make_patch_call(f'attributes/{attribute["attributeId"]}', {
                            'value': contact_attribute.value
                        })
                
        for contact_attribute in contact_attributes.values():
            if not contact_attribute.found:
                print(f'Setting field {contact_attribute.label}={contact_attribute.value}')
                make_post_call(f'attributes', {
                    'noteId': note['noteId'],
                    'type': 'label',
                    'name': contact_attribute.label,
                    'value': contact_attribute.value
                })
```