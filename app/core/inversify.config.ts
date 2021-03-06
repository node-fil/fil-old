import {decorate, injectable, Kernel} from "inversify";
import {makeProvideDecorator} from "inversify-binding-decorators";
import getDecorators from "inversify-inject-decorators";
import "reflect-metadata";

let kernel = new Kernel();

let {lazyInject} = getDecorators(kernel);
let provide = makeProvideDecorator(kernel);

let TYPES = {
  CategoryConstructor: Symbol(),
  CollectionConstructor: Symbol(),
  CollectionStatic: Symbol(),
  Config: Symbol(),
  ContentAssetConstructor: Symbol(),
  ContentConstructor: Symbol(),
  ContentLookupConstructor: Symbol(),
  ContentStatic: Symbol(),
  Fil: Symbol(),
  ImageResizer: Symbol(),
  Logger: Symbol(),
  Page: Symbol(),
  RhoConstructor: Symbol(),
  Sitemap: Symbol(),
  SortingHelper: Symbol(),
  Template: Symbol(),
  Watcher: Symbol()
};

let provideConstructor = (serviceIdentifier: symbol) => {
  return (target) => {
    decorate(injectable(), target);
    kernel.bind(serviceIdentifier).toConstructor(target);
    return target;
  };
};
let provideSingleton = (serviceIdentifier: symbol) => {
  return (target) => {
    decorate(injectable(), target);
    kernel.bind(serviceIdentifier).to(target).inSingletonScope();
    return target;
  };
};

export { TYPES, lazyInject, provide, kernel, provideConstructor, provideSingleton };
