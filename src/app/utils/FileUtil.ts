import { YumpuDocument } from './../model/YumpuDocument';
import * as jszip from 'jszip';

export abstract class FileUtil {

    public static addFileToZip(zip: jszip, fileName: string, fileData: string): jszip {
        return zip.file(fileName, fileData.split('base64')[1], { base64: true })
    }

    public static zipDocument(document: YumpuDocument): Promise<Blob> {
        let zip = new jszip();
        for (let i = 0; i < document.pages.length; i++) {
            this.addFileToZip(zip, `${i + 1}.jpg`, document.pages[i].data);
        }
        return zip.generateAsync({ type: 'blob' });
    }

    public static downloadFromMemory(fileName: string, fileData: string | Blob) {
        let a = document.createElement("a");
        document.body.appendChild(a);
        let data: Blob = fileData instanceof Blob ? fileData : FileUtil.dataURItoBlob(<string>fileData);
        let url = window.URL.createObjectURL(data);
        a.href = url;
        a.download = fileName;
        a.click();
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url);
    }

    public static dataURItoBlob(dataURI: string) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var bb = new Blob([ab], { type: mimeString });
        return bb;
    }
}