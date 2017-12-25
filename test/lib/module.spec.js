const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { Writable } = require('stream');
const tar = require('tar');
const recursive = require('recursive-readdir');
const rimraf = require('rimraf');

const {
  isValidNamespace, isValidName, isValidVersion, makeFileList, makeTarball,
} = require('../../lib/module');

describe('module\'s', () => {
  describe('isValidNamespace()', () => {
    it('should check namespace consists of alphanumeric characters ', () => {
      const result = isValidNamespace('1a2b3c');
      expect(result).to.be.true;
    });

    it('should check namespace consists of alphanumeric characters or single hyphens', () => {
      const result = isValidNamespace('abc-123');
      expect(result).to.be.true;
    });

    it('should check namespace which begins with a hyphen', () => {
      const result = isValidNamespace('-abc123');
      expect(result).to.be.false;
    });

    it('should check namespace which ends with a hyphen', () => {
      const result = isValidNamespace('abc123-');
      expect(result).to.be.false;
    });
  });

  describe('isValidName()', () => {
    it('should check module name which formatted in terraform-PROVIDER-NAME', () => {
      const result = isValidName('terraform-aws-consul');
      expect(result).to.be.true;
    });

    it('should check module name which doesn\'t formatted in terraform-PROVIDER-NAME', () => {
      const result = isValidName('terraform-aws-');
      expect(result).to.be.false;
    });

    it('should check module name which contain special characters', () => {
      const result = isValidName('terraform-aws-cons$ul');
      expect(result).to.be.false;
    });
  });

  describe('isValidVersion()', () => {
    it('should check semver format', () => {
      const result = isValidVersion('0.1.0');
      expect(result).to.be.equal('0.1.0');
    });

    it('should check semver format with v prefix', () => {
      const result = isValidVersion('v0.1.0');
      expect(result).to.be.equal('0.1.0');
    });

    it('should check no semver format', () => {
      const result = isValidVersion('0.1');
      expect(result).to.be.null;
    });
  });

  describe('makeFileList()', () => {
    it('should make file list', async () => {
      const target = path.join(__dirname, '../fixture/module1');
      const result = await makeFileList(target);
      expect(result).to.have.members(['b.js', 'c/d.js', 'c/e.js', 'README.md', 'a.js']);
    });

    it('should ignore files depends on .gitignore', async () => {
      const target = path.join(__dirname, '../fixture/module2');
      const result = await makeFileList(target);
      expect(result).to.have.members(['b.js', 'a.js']);
    });
  });

  describe('makeTarball()', () => {
    it('should compress module files to an writable stream', (done) => {
      const writer = new Writable({
        write(chunk, encoding, callback) {
          callback();
        },
      });
      writer.on('finish', done);

      const target = path.join(__dirname, '../fixture/module1');
      const files = ['a.js', 'b.js', 'c', 'c/d.js', 'c/e.js', 'README.md'];
      const result = makeTarball(target, files, writer);

      expect(result).to.be.an.instanceof(Writable);
    });

    it('should make module filses as tarball', (done) => {
      const UNTAR_DIR = 'test/untar';
      fs.mkdirSync(UNTAR_DIR);

      const target = path.join(__dirname, '../fixture/module1');
      const files = ['a.js', 'b.js', 'c', 'c/d.js', 'c/e.js', 'README.md'];
      const result = makeTarball(target, files, tar.x({
        cwd: UNTAR_DIR,
      }));

      result.on('finish', () => {
        recursive(UNTAR_DIR, (err, list) => {
          expect(list).to.have.members([
            `${UNTAR_DIR}/a.js`,
            `${UNTAR_DIR}/b.js`,
            `${UNTAR_DIR}/c/d.js`,
            `${UNTAR_DIR}/c/e.js`,
            `${UNTAR_DIR}/README.md`,
          ]);
          rimraf(UNTAR_DIR, done);
        });
      });
    });

    it('should make module filses with .gitignore as tarball', (done) => {
      const UNTAR_DIR = 'test/untar';
      fs.mkdirSync(UNTAR_DIR);

      const target = path.join(__dirname, '../fixture/module2');
      const files = ['a.js', 'b.js'];
      const result = makeTarball(target, files, tar.x({
        cwd: UNTAR_DIR,
      }));

      result.on('finish', () => {
        recursive(UNTAR_DIR, (err, list) => {
          expect(list).to.have.members([
            `${UNTAR_DIR}/a.js`,
            `${UNTAR_DIR}/b.js`,
          ]);
          rimraf(UNTAR_DIR, done);
        });
      });
    });
  });
});
