import {Collection} from "./models/collection";
import {Config} from "./lib/config";
import {Content} from "./models/content";
import {Assets} from "./lib/assets";

import fs = require("fs-extra");
import path = require("path");
import jade = require("jade");
import {ContentLookup} from "./models/contentLookup";

let startDate = new Date();

// init config
let config = Config.getConfig();

// init collections
let collections = config.collections.definition.map(
  collectionDefinition => Collection.fromCollectionConfig(collectionDefinition, config.collections.config)
);

// init contents
let contents: Array<Content> = Content.fromPostsFolder();

// prepare contents
contents.forEach(content => {
  content.registerOnCollections(collections);
});

// prepare collections
collections.forEach(
  collection => {
    collection.sortCategories();
    collection.calculatePagination();
  }
);

// write contents
let contentLookup = new ContentLookup(contents);
contents.forEach((content) => {
  content.calculateHtmlContent(contentLookup);
  content.renderToFile(collections);
  content.processContentAssets();
});

// prepare collections
collections.forEach(
  collection => {
    collection.renderToFile(collections);
  }
);

// write other stuff
Assets.processTemplateScripts();
Assets.processTemplateImages();
Assets.processStylesheets();

let endDate = new Date();
console.info(`Execution time: ${(+endDate) - (+startDate)}ms`);
