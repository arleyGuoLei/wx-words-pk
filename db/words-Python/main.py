import requests
import json
import zipfile
import os

path = os.getcwd()

def getBooksId():
    url = "http://reciteword.youdao.com/reciteword/v1/param?key=normalBooks&keyfrom=reciteword.1.5.12.android&vendor=xiaomi&mid=9&imei=CQlkYjRlZWEwYzZlYmRiYjkyCXVua25vd24%253D&screen=1080x1920&model=Mi_Note_3&version=1.5.12"
    bookList = json.loads(requests.get(url).text)["data"]["normalBooks"]["bookList"]
    BooksId = []
    for book in bookList:
        BooksId.append(book["id"])
    return BooksId

def getBooksDownLink(booksId):
    url = "http://reciteword.youdao.com/reciteword/v1/getBooksInfo?keyfrom=reciteword.1.5.12.android&vendor=xiaomi&mid=9&imei=CQlkYjRlZWEwYzZlYmRiYjkyCXVua25vd24%253D&screen=1080x1920&model=Mi_Note_3&version=1.5.12"
    payload = {'bookIds': json.dumps(booksId), 'reciteType': 'normal'}
    booksInfo = json.loads(requests.post(url, data = payload).text)["data"]["normalBooksInfo"]
    downlink = []
    for book in booksInfo:
        downlink.append({"title": book["title"], "link": book["offlinedata"]})
    return downlink

def downBook(fileName, link):
    r = requests.get(link, stream=True)
    linkname = link[link.find(".com/") + 5:]
    with open(linkname, 'wb') as fd:
            fd.write(r.content)
    try:
        zipfileName = path + "/" + linkname
        print(zipfileName)
        file = zipfile.ZipFile(zipfileName)
        file.extractall(fileName)
        file.close()
    except Exception as e:
        print(e)

def main():
    BooksId = getBooksId()
    print(BooksId)
    downlink = getBooksDownLink(BooksId)
    print(downlink)

    for book in downlink:
        downBook(book["title"], book["link"])

if __name__ == '__main__':
    main()