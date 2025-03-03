import { readJson, readNxJson, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { nuxtInitGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add nuxt dependencies', async () => {
    await nuxtInitGenerator(tree, {
      skipFormat: false,
    });
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson).toMatchSnapshot();
  });

  describe('pcv3', () => {
    beforeEach(() => {
      tree = createTreeWithEmptyWorkspace();
    });

    it('should not add targets', async () => {
      await nuxtInitGenerator(tree, {
        skipFormat: false,
      });
      const nxJson = readNxJson(tree);
      expect(nxJson.plugins).toMatchObject([
        {
          options: { buildTargetName: 'build', serveTargetName: 'serve' },
          plugin: '@nx/nuxt/plugin',
        },
      ]);
    });
  });
});
