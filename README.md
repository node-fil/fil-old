# Fil

[![Gitter](https://img.shields.io/gitter/room/ubenzer/fil.svg?maxAge=2592000&style=flat-square)](https://gitter.im/ubenzer/fil)
[![Travis](https://img.shields.io/travis/ubenzer/fil.svg?maxAge=3600&style=flat-square)](https://travis-ci.org/ubenzer/fil)
[![David](https://img.shields.io/david/ubenzer/fil.svg?maxAge=3600&style=flat-square)](https://david-dm.org/ubenzer/fil)
[![David](https://img.shields.io/david/dev/ubenzer/fil.svg?maxAge=3600&style=flat-square)](https://david-dm.org/ubenzer/fil#info=devDependencies)
[![Codecov](https://img.shields.io/codecov/c/github/ubenzer/fil.svg?maxAge=3600&style=flat-square)](https://codecov.io/gh/ubenzer/fil)
[![npm](https://img.shields.io/npm/v/fil.svg?maxAge=3600&style=flat-square)](https://www.npmjs.com/package/fil)
[![npm](https://img.shields.io/npm/dt/fil.svg?maxAge=3600&style=flat-square)](https://www.npmjs.com/package/fil)
[![Beerpay](https://img.shields.io/beerpay/ubenzer/fil.svg?maxAge=2592000&style=flat-square)](https://beerpay.io/ubenzer/fil)
   
Fil is a static content engine that can be used to host no-so-dynamic web sites such as blogs, technical documents, 
internal company tech wikies and content management systems.

## Features
1. Super fast!
2. Supports multiple content hierarchies (date archive, (sub)categories, tags, people etc.) via configuration files.
3. Uses Pug as template engine.
4. You can hook your own asset build system for icons, images, javascripts files etc.
5. Supports static "page"s. (special content such as home page, contact page etc.)

## How get started
A cli is planned for future releases but for now, everything is manual :/ Feel free to improve this process.

0. Please check that your system conforms [requirements](#requirements).
1. Install `fil` globally: `npm i -g fil` 
 
At this point you installed `fil` successfully! Now you need a starter project, a basic template with sample
posts that demonstrates `fil`'s various features. This way, it will be faster to start.
 
0. Navigate to a folder that you want to install stater-project.
1. Clone latest version of starter project: `git clone --depth 1 https://github.com/ubenzer/fil-starter-project.git`
2. Starter project will be in `fil-starter-project` folder. If you want, you can rename it.
3. Go into starter project directory. `cd fil-starter-project`.
4. Install dependencies of starter project. `npm i`.
5. To customize most of the settings, you can edit `config.js`.
6. To build it via `fil`, run `fil` on your console. If you want to build continiously you can type `fil --watch`.
7. That is it, it is built into `dist` folder!
8. Run `npm run serve` to start a web server on `http://localhost:8765` to view your brand new static web site.

To learn more about starter project and development specifics tasks, see 
[README of starter project](https://github.com/ubenzer/fil-starter-project).

## Requirements
1. Node.js 6.5.0+
2. npm 3.x
3. System libraries required for [sharp](http://sharp.readthedocs.io/en/stable/install/).

## Architecture
A `fil` website has two parts:

1. The compiler: It is the `fil` package you installed via npm. Normally, you use it as is, if you are not developing
a feature to library itself. Compiler is responsible for:

    a. Read project config.
    
    b. Compile contents to HTML.
    
    c. Process content images into requested sizes and formats.
    
    d. Create collection and category pages using content based on project config.
    
    e. Create static pages (pages that doesn't depend on a content)
    
    f. Run asset generation script defined on project config to prepare frontend assets. (e.g. compile sass, minify js
     files etc.)
  
2. The project: It is the whole project files that is related with your website. Usually this contains the following:

    a. `config.js`: A config file that tells the compiler what to do, which kind of collections to create,
     how to process images etc.
     
    b. `contents/`: Contents, that are going to be compiled to HTML using a template based on rules in config.
    
    c. `template/`: Templates, that are skeletons for web site, they will be merged with contents and compiled down
     to actual website.
     
    d. `site/`: Frontend related stuff, such as theme images, javascript files and stylesheets, that are not a part
     of content, and creation/compiling of this assets are not managed by compiler but it is managed by the project.
     
The structure of the project is not enforced anyway. The described structure is a part of 
[fil-starter-project](https://github.com/ubenzer/fil-starter-project) but one can use a completely different 
approach. Only real requirement for the compiler is that, the project needs to provide a config file.
Rest is up to the project.

## ROADMAP
The following features are planned. Not in particular order.
1. "Content snippet"s that are not a part of taxonomy which can be included as a part of static pages.
2. Better handling of async tasks.
3. Better caching.
4. Ability to run compiler partially. (e.g. only build pages but not categories etc.)
5. Hook mechanism similar to frontend build system hook for publishing.
6. Improve code coverage.

## Contributing
No defined way of contributing yet. Just go wild. %-) If you are planning to add a new feature, open a PR and let's
discuss it first.

## Setting up development environment
To setup your development environment, first please check you have the things described in
Requirements section are met.

Fil is written in `typescript`. Therefore we recommend you to have the following global node packages:
`npm i -g typescript typings` 

Although these are not mandatory, they will make your life easier.

Clone latest master to your local box:
`git clone git@github.com:ubenzer/fil.git`

Run `npm i` to install dependencies.

To compile `typescript` to `javascript` you can run `npm run dev:compile`. There is no automatic wacth & compile
method available at this point.

To install type definitions you can run `npm run dev:typings`.

If you want to compile a project using `fil`'s master version, you can call fil like this:
```sh
# In the working directory of the website project
node /PATH/TO/FIL/build/app/cli.js
```

## Alternatives
Fil is a project work in progress and no commitments made at this point. If you need a more mature project, you can
check [Jekyll](https://jekyllrb.com/) (ruby), [Hexo](https://hexo.io) (js) or [Hugo](https://gohugo.io/)(go).
