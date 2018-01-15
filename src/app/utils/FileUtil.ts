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
}