import json
import os
import subprocess
import time


class ParticleBase:

  def update_pubspec_dependency(self):
    with open(self.package_path, 'r') as file:
      data = json.load(file)
      dependencies = data.get('dependencies')
      if "@particle-network/rn-auth" in dependencies:
        if data['dependencies']['@particle-network/rn-auth'] != "file:..":
          data['dependencies']['@particle-network/rn-auth'] = self.version
      if "@particle-network/rn-connect" in dependencies:
        if (data['dependencies']['@particle-network/rn-connect'] != "file:.."):
          data['dependencies']['@particle-network/rn-connect'] = self.version
      if "@particle-network/rn-wallet" in dependencies:
        if data['dependencies']['@particle-network/rn-wallet'] != "file:..":
          data['dependencies']['@particle-network/rn-wallet'] = self.version
      if "@particle-network/rn-auth-core" in dependencies:
        if data['dependencies']['@particle-network/rn-auth-core'] != "file:..":
          data['dependencies']['@particle-network/rn-auth-core'] = self.version
      if "@particle-network/rn-aa" in dependencies:
        if data['dependencies']['@particle-network/rn-aa'] != "file:..":
          data['dependencies']['@particle-network/rn-aa'] = self.version
    
    with open(self.package_path, 'w') as file:
      json.dump(data, file, indent=2)

  def __init__(self, version):
    self.version = version
    self.package_path = 'package.json'

  def replace_version(self):
    key = "version"
    value = self.version
    
    with open(self.package_path, 'r') as file:
      data = json.load(file)

    
    if key in data:
      data[key] = value
    else:
      print(f"Key {key} not found in file {self.package_path}")

    
    with open(self.package_path, 'w') as file:
      json.dump(data, file, indent=2)

  def rn_publish_dry_run(self):
    subprocess.run(['npm', 'publish', '--dry-run'])

  def rn_publish(self):
    subprocess.run(['npm', 'publish'])

  def rn_get(self):
    # subprocess.run(['npm', 'install'])
    pass
  def close(self):
    os.chdir("..")

  def prepare(self):
    self.replace_version()

  def self_prepare(self):
    self.update_pubspec_dependency()
    os.chdir("example")
    self.update_pubspec_dependency()
    os.chdir("..")


class ParticleAuth(ParticleBase):
  def __init__(self, version):
    os.chdir("particle-auth")
    super().__init__(version)

  def publish(self):
    self.prepare()
    self.rn_publish()
    self.close()

  def publish_dry_run(self):
    self.prepare()
    self.rn_publish_dry_run()
    self.close()

class ParticleConnect(ParticleBase):
  def __init__(self, version):
    os.chdir("particle-connect")
    super().__init__(version)

  def publish(self):
    self.prepare()
    self.self_prepare()

    self.rn_get()
    self.rn_publish()
    self.close()


class ParticleAuthCore(ParticleBase):
  def __init__(self, version):
    os.chdir("particle-auth-core")
    super().__init__(version)

  def publish(self):
    self.prepare()
    self.self_prepare()
    self.rn_get()
    self.rn_publish()
    self.close()


class ParticleAA(ParticleBase):
  def __init__(self, version):
    os.chdir("particle-aa")
    super().__init__(version)

  def publish(self):
    self.prepare()
    self.self_prepare()
    self.rn_get()
    self.rn_publish()
    self.close()


class ParticleWallet(ParticleBase):
  def __init__(self, version):
    os.chdir("particle-wallet")
    super().__init__(version)

  def publish(self):
    self.prepare()
    self.self_prepare()
    self.rn_get()
    self.rn_publish()
    self.close()


if __name__ == "__main__":
  version = '1.4.0'
  sleep_time = 5
  print("Auth Start")
  ParticleAuth(version).publish()
  print("Auth Finish")
  time.sleep(sleep_time)

  print("AuthCore Start")
  ParticleAuthCore(version).publish()
  print("AuthCore Finish")
  time.sleep(sleep_time)

  print("Connect Start")
  ParticleConnect(version).publish()
  print("Connect Finish")

  time.sleep(sleep_time)
  print("ParticleAA Start")
  ParticleAA(version).publish()
  print("ParticleAA Finish")
  time.sleep(sleep_time)
  print("ParticleWallet Start")
  ParticleWallet(version).publish()
  print("ParticleWallet Finish")
