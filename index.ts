import {Collection} from "./models/collection";
import {Config} from "./lib/config";
import {Constants} from "./constants";
import {Content} from "./models/content";
import {Assets} from "./lib/assets";

import fs = require("fs-extra");
import path = require("path");
import jade = require("jade");
import {ContentLookup} from "./models/contentLookup";

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
// TODO

// write contents
let contentLookup = new ContentLookup(contents);
contents.forEach((content) => {
  content.calculateHtmlContent(contentLookup);
  content.renderToFile();
  content.processContentAssets();
});

// write collections
let builtTemplate = jade.compileFile(
  path.join(Constants.TEMPLATE_DIR, "index.jade"),
  {pretty: true}
)({
  posts: contents
});
fs.outputFileSync(path.join(Constants.OUTPUT_DIR, "index.html"), builtTemplate);

// write other stuff
Assets.processTemplateImages();
Assets.processStylesheets();
