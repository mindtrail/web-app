import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { JSONLoader, JSONLinesLoader } from 'langchain/document_loaders/fs/json'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { SRTLoader } from 'langchain/document_loaders/fs/srt'
import { TextLoader } from 'langchain/document_loaders/fs/text'

export type FILE_LOADER_PAIR = {
  [key: string]:
    | typeof CSVLoader
    | typeof DocxLoader
    // | typeof EPubLoader
    | typeof JSONLoader
    | typeof JSONLinesLoader
    | typeof PDFLoader
    | typeof SRTLoader
    | typeof TextLoader
}
