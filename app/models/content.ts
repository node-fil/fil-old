import * as fs from "fs-extra";
import * as glob from "glob";
import * as moment from "moment";
import * as path from "path";

import {Collection, IContentBelongsTo} from "./collection";
import {Config} from "../lib/config";
import {Template} from "../lib/template";
import {ContentLookup} from "./contentLookup";
import {Rho} from "../lib/rho";
import {ContentAsset} from "./contentAsset";
import {ImageResizer} from "../lib/imageResizer";
import {lazyInject, provideConstructor, TYPES} from "../inversify.config";

let slug = require("slug");

const HTML_PAGE_NAME = "index.html";

@provideConstructor(TYPES.ContentConstructor)
export class Content {
  @lazyInject(TYPES.Config)
  private Config: Config;

  @lazyInject(TYPES.ImageResizer)
  private ImageResizer: ImageResizer;

  @lazyInject(TYPES.Template)
  private Template: Template;

  contentId: string; // content's id, using this it can be referenced
  inputFolder: string; // content directory root relative to CONTENTS_DIR
  outputFolder: string; // content's final path, relative to OUTPUT_DIR

  title: string; // content title
  content: string; // original content
  templateFile: string; // which jade template to be used, relative to template folder
  createDate: moment.Moment; // content's original creation date
  editDate: moment.Moment; // content's last update date

  htmlContent: string = null; // compiled html content, this is null, call calculateHtmlContent() once to fill this.
  htmlExcerpt: string = null; // compiled excerpt, this is null, call calculateHtmlContent() once to fill this.

  belongsTo: Map<Collection, Array<IContentBelongsTo>>; // relationship map, which categories this content belongs to
  private fileAssetsCache: Array<ContentAsset> = null; // files attached to this content as array of file name relative to inputFolder
  get fileAssets(): Array<ContentAsset> {
    if (this.fileAssetsCache === null) {
      this.fileAssetsCache = this.initFileAssets();
    }
    return this.fileAssetsCache;
  }

  rawFrontmatter: Object; // this is going to be used to calculate category relationships
  constructor(
    contentId: string,
    inputFolder: string,
    outputFolder: string,
    title: string,
    content: string,
    templateFile: string = "content.jade",
    createDate: Date,
    editDate: Date,
    rawFrontmatter: Object
  ) {
    this.inputFolder = inputFolder;
    this.title = title;
    this.content = content;
    this.templateFile = templateFile;
    this.createDate = moment(createDate);
    this.editDate = moment(editDate);
    this.contentId = contentId;
    this.outputFolder = outputFolder;
    this.rawFrontmatter = rawFrontmatter;
    this.belongsTo = new Map();
  }

  /**
   * Registers this content into collections provided
   * in collection list and updates `belongsTo` field.
   *
   * It is expected that collection list here also updates
   * their own index and include this Content object
   * in their proper Category objects.
   *
   * @param collectionList that this Content is going to be registered
     */
  registerOnCollections(collectionList: Array<Collection>): void {
    collectionList.forEach(
      collection => {
        this.belongsTo.set(collection, collection.registerContent(this));
      }
    );
  }

  /**
   * Renders content and writes to specified file
   * @param collections Whole available collections in the system
     */
  renderToFile(collections: Array<Collection>): void {
    let builtTemplate = this.Template.renderContent(this, collections);
    let normalizedPath = path.join(this.Config.OUTPUT_DIR, this.outputFolder, HTML_PAGE_NAME);

    fs.outputFileSync(normalizedPath, builtTemplate);
  }

  /**
   * Renders original content as rendered html, sets htmlContent
   * field of this content object and returns it
   * @param {ContentLookup} contentLookup object that is going
   * to be used to resolve references to file assets and other contents.
   */
  calculateHtmlContent(contentLookup: ContentLookup): void {
    console.log(`Compiling ${this.contentId}...`);

    let compiler = new Rho(this, contentLookup);

    // check if we have predetermined excerpt break
    let separatedContent = this.content.split("---more---");
    if (separatedContent.length > 1) {
      this.htmlExcerpt = compiler.toHtml(separatedContent[0]);
      this.htmlContent = compiler.toHtml(separatedContent.join("\n\n"));
    } else {
      this.htmlContent = compiler.toHtml(this.content);
      this.htmlExcerpt = this.htmlContent;
    }
  }

  /**
   * Returns permalink URL for this Content. This can be used to reference
   * this content in compiled output.
   * @returns {string}
     */
  getUrl(): string {
    return `${this.outputFolder.replace(new RegExp(path.sep, "g"), "/")}/`;
  }

  /**
   * Copies ContentAssets related to this content to output folder
   */
  processContentAssets(): void {
    this.fileAssets.forEach(asset => {
      let inputFile = path.join(this.Config.CONTENTS_DIR, this.inputFolder, asset.inputFile);
      let outputFile = path.join(this.Config.OUTPUT_DIR, asset.getOutputFile());
      fs.copySync(inputFile, outputFile);

      // For images, also create bunch of different sizes for network performance
      if (asset.isImage) {
        this.ImageResizer.resize(inputFile, outputFile);
      }
    });
  }

  /**
   * Finds assets associated with this content and initializes them
   * @returns Array<ContentAsset> ContentAsset objects
   */
  private initFileAssets(): Array<ContentAsset> {
    return glob.sync("**/*", {
      cwd: path.join(this.Config.CONTENTS_DIR, this.inputFolder),
      mark: true
    })
      .filter(f => f !== "index.md")
      .filter(f => !f.endsWith("/")) // get rid of folders as we handle everything in file-basis
      .map(fileName => new ContentAsset(fileName, this));
  }
}