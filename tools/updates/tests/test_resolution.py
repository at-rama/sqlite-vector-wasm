"""Exercise the existing A-inputs resolver as consumed by preparation; metadata is synthetic."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('input_fixtures', Path(__file__).resolve().parents[2] / 'tests/test_inputs.py')
f = importlib.util.module_from_spec(spec)
spec.loader.exec_module(f)


class PreparationResolutionTest(unittest.TestCase):
    def resolve(self, version, releases=None, baseline=None, fetch=f.vector_metadata):
        return f.inputs.resolve_vector_pair(f.metadata()[0], releases if releases is not None else [f.vector_release(version)],
            sqlite_version='3.53.4', vector_version=version, baseline=baseline, fetch=fetch,
            archive_digest=lambda _: 'd' * 64)

    def test_exact_stable_and_published_prereleases(self):
        for version in ['1.1.2', '1.1.1', '1.2.0-alpha.1', '1.2.0-beta.1', '1.2.0-rc.1']:
            with self.subTest(version=version):
                selected = self.resolve(version)
                self.assertEqual(selected['sqliteVector']['version'], version)
                self.assertEqual(self.resolve(version, baseline=selected), selected)

    def test_unpublished_draft_alias_and_binding_drift_fail(self):
        for version in ['main', 'latest', 'next', '1.2.0-dev.1']:
            with self.subTest(version=version), self.assertRaises(Exception):
                self.resolve(version, releases=[f.vector_release()])
        for mutation in [lambda r: r.update(draft=True), lambda r: r.update(published_at=None)]:
            release = f.vector_release('1.2.0-alpha.1')
            mutation(release)
            with self.assertRaises(Exception):
                self.resolve('1.2.0-alpha.1', releases=[release])
        baseline = self.resolve('1.1.2')
        def drift(url):
            return f.vector_metadata(url).replace(f.VECTOR_COMMIT, 'e' * 40)
        with self.assertRaises(Exception):
            self.resolve('1.1.2', baseline=baseline, fetch=drift)
        baseline['sqliteVector']['digest']['value'] = '0' * 64
        # The independently announced digest contradicts the established pin.
        with self.assertRaises(f.inputs.InputError):
            self.resolve('1.1.2', baseline=baseline)


if __name__ == '__main__':
    unittest.main()
