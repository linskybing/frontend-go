const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const file = path.resolve(__dirname, '../../template/localization.yaml');
if (!fs.existsSync(file)) {
  console.error('File not found:', file);
  process.exit(2);
}

const content = fs.readFileSync(file, 'utf8');
const docs = yaml.loadAll(content);

docs.forEach((doc, idx) => {
  if (!doc || typeof doc !== 'object') return;
  const kind = doc.kind;
  const name = doc.metadata?.name || `doc-${idx}`;
  if (!['Pod','Deployment','Job'].includes(kind)) return;
  console.log(`\n=== ${kind} ${name} ===`);

  // find volumes
  const spec = doc.spec || {};
  const volumes = spec.volumes || [];
  console.log('volumes:');
  volumes.forEach((v) => {
    const keys = Object.keys(v).filter((k) => k !== 'name');
    if (v.persistentVolumeClaim) {
      console.log(` - ${v.name}: persistentVolumeClaim -> claimName=${v.persistentVolumeClaim.claimName}`);
    } else if (v.emptyDir) {
      console.log(` - ${v.name}: emptyDir -> ${JSON.stringify(v.emptyDir)}`);
    } else if (v.configMap) {
      console.log(` - ${v.name}: configMap -> name=${v.configMap.name}`);
    } else if (v.nfs) {
      console.log(` - ${v.name}: nfs -> ${JSON.stringify(v.nfs)}`);
    } else {
      console.log(` - ${v.name}: unknown -> keys=${keys.join(',')}`);
    }
  });

  // find containers and mounts
  const containers = spec.containers || [];
  containers.forEach((c) => {
    console.log(`\n container: ${c.name}`);
    (c.volumeMounts || []).forEach((m) => {
      console.log(`  - mount name=${m.name} mountPath=${m.mountPath} subPath=${m.subPath || ''}`);
    });
  });
});

console.log('\nDone');
