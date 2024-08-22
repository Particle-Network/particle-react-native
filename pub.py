import json
import os
import subprocess
import time


class ParticleBase:

  def update_pubspec_dependency(self):
    with open(self.package_path, 'r') as file:
      data = json.load(file)
      dependencies = data.get('dependencies')
      if self.beta_mode:
        if "@particle-network/rn-base" in dependencies or "rn-base-beta" in dependencies:
          if("@particle-network/rn-base" in dependencies):
            data['dependencies'].pop('@particle-network/rn-base')
          if "rn-base-beta" in dependencies:
            if data['dependencies']['rn-base-beta'] != "file:..":
              data['dependencies']['rn-base-beta'] = self.version
          else:
            data['dependencies']['rn-base-beta'] = self.version


        if "@particle-network/rn-connect" in dependencies or "rn-connect-beta" in dependencies:
          if "@particle-network/rn-connect" in dependencies:
            data['dependencies'].pop('@particle-network/rn-connect')
          if "@particle-network/rn-connect-beta" in dependencies:
            if (data['dependencies']['rn-connect-beta'] != "file:.."):
              data['dependencies']['rn-connect-beta'] = self.version
          else:
            data['dependencies']['rn-connect-beta'] = self.version

        if "@particle-network/rn-wallet" in dependencies or "rn-wallet-beta" in dependencies:
          if "@particle-network/rn-wallet" in dependencies:
            data['dependencies'].pop('@particle-network/rn-wallet')
          if "@particle-network/rn-wallet-beta" in dependencies:
            if data['dependencies']['rn-wallet-beta'] != "file:..":
              data['dependencies']['rn-wallet-beta'] = self.version
          else:
            data['dependencies']['rn-wallet-beta'] = self.version

        if "@particle-network/rn-auth-core" in dependencies or "rn-auth-core-beta" in dependencies:
          if "@particle-network/rn-auth-core" in dependencies:
            data['dependencies'].pop('@particle-network/rn-auth-core')

          if "@particle-network/rn-auth-core-beta" in dependencies:
            if data['dependencies']['rn-auth-core-beta'] != "file:..":
              data['dependencies']['rn-auth-core-beta'] = self.version
          else:
            data['dependencies']['rn-auth-core-beta'] = self.version

        if "@particle-network/rn-aa" in dependencies or "rn-aa-beta" in dependencies:
          if "@particle-network/rn-aa" in dependencies:
            data['dependencies'].pop('@particle-network/rn-aa')
          if "@particle-network/rn-aa-beta" in dependencies:
            if data['dependencies']['rn-aa-beta'] != "file:..":
              data['dependencies']['rn-aa-beta'] = self.version
          else:
            data['dependencies']['rn-aa-beta'] = self.version
      else:
        if "rn-base-beta" in dependencies or "@particle-network/rn-base" in dependencies:
          if "rn-base-beta" in dependencies:
            data['dependencies'].pop('rn-base-beta')
          if "@particle-network/rn-base" in dependencies:
            if data['dependencies']['@particle-network/rn-base'] != "file:..":
              data['dependencies']['@particle-network/rn-base'] = self.version
          else:
            data['dependencies']['@particle-network/rn-base'] = self.version

        if "rn-connect-beta" in dependencies or "@particle-network/rn-connect" in dependencies:
          if "rn-connect-beta" in dependencies:
            data['dependencies'].pop('rn-connect-beta')

          if "@particle-network/rn-connect" in dependencies:
            if data['dependencies']['@particle-network/rn-connect'] != "file:..":
              data['dependencies']['@particle-network/rn-connect'] = self.version
          else:
            data['dependencies']['@particle-network/rn-connect'] = self.version

        if "rn-wallet-beta" in dependencies or "@particle-network/rn-wallet" in dependencies:
          if "rn-wallet-beta" in dependencies:
            data['dependencies'].pop('rn-wallet-beta')
          if "@particle-network/rn-wallet" in dependencies:
            if data['dependencies']['@particle-network/rn-wallet'] != "file:..":
              data['dependencies']['@particle-network/rn-wallet'] = self.version
          else:
            data['dependencies']['@particle-network/rn-wallet'] = self.version

        if "rn-auth-core-beta" in dependencies or "@particle-network/rn-auth-core" in dependencies:
          if "rn-auth-core-beta" in dependencies:
            data['dependencies'].pop('rn-auth-core-beta')
          if "@particle-network/rn-auth-core" in dependencies:
            if data['dependencies']['@particle-network/rn-auth-core'] != "file:..":
              data['dependencies']['@particle-network/rn-auth-core'] = self.version
          else:
            data['dependencies']['@particle-network/rn-auth-core'] = self.version

        if "rn-aa-beta" in dependencies or "@particle-network/rn-aa" in dependencies:
          if "rn-aa-beta" in dependencies:
            data['dependencies'].pop('rn-aa-beta')
          if "@particle-network/rn-aa" in dependencies:
            if data['dependencies']['@particle-network/rn-aa'] != "file:..":
              data['dependencies']['@particle-network/rn-aa'] = self.version
          else:
            data['dependencies']['@particle-network/rn-aa'] = self.version


    with open(self.package_path, 'w') as file:
      json.dump(data, file, indent=2)

  def __init__(self, version):
    self.version = version
    self.package_path = 'package.json'

  def replace_name_version(self):
    key_version = "version"
    value_version = self.version
    key_name = "name"
    if not self.beta_mode:
      value_name = self.production_name
    else:
      value_name = self.beta_name
    print(value_name)

    with open(self.package_path, 'r') as file:
      data = json.load(file)

    if key_version in data:
      data[key_version] = value_version
    else:
      print(f"Key {key_version} not found in file {self.package_path}")

    if key_name in data:
      data[key_name] = value_name
    else:
      print(f"Key {key_name} not found in file {self.package_path}")

    with open(self.package_path, 'w') as file:
      json.dump(data, file, indent=2)

  def rn_publish_dry_run(self):
    subprocess.run(['npm', 'publish', '--dry-run'])
    pass

  def rn_publish(self):
    subprocess.run(['npm', 'publish'])
    pass

  def rn_get(self):
    subprocess.run(['npm', 'install'])
    pass

  def close(self):
    os.chdir("..")

  def prepare(self):
    self.replace_name_version()

  def self_prepare(self):
    self.update_pubspec_dependency()
    os.chdir("example")
    self.update_pubspec_dependency()
    os.chdir("..")


class ParticleBaseModule(ParticleBase):
  beta_name = "rn-base-beta"
  production_name = "@particle-network/rn-base"

  def __init__(self, version, beta_mode):
    os.chdir("particle-base")
    self.beta_mode = beta_mode
    super().__init__(version)

  def publish(self):
    self.prepare()
    self.rn_publish()
    self.close()

  def publish_dry_run(self):
    self.prepare()
    self.rn_publish_dry_run()
    self.close()


class ParticleConnectModule(ParticleBase):
  beta_name = "rn-connect-beta"
  production_name = "@particle-network/rn-connect"

  def __init__(self, version, beta_mode):
    os.chdir("particle-connect")
    self.beta_mode = beta_mode
    super().__init__(version)

  def publish(self):
    self.prepare()
    self.self_prepare()

    self.rn_get()
    self.rn_publish()
    self.close()


class ParticleAuthCoreModule(ParticleBase):
  beta_name = "rn-auth-core-beta"
  production_name = "@particle-network/rn-auth-core"

  def __init__(self, version, beta_mode):
    os.chdir("particle-auth-core")
    self.beta_mode = beta_mode
    super().__init__(version)

  def publish(self):
    self.prepare()
    self.self_prepare()
    self.rn_get()
    self.rn_publish()
    self.close()


class ParticleAAModule(ParticleBase):
  beta_name = "rn-aa-beta"
  production_name = "@particle-network/rn-aa"

  def __init__(self, version, beta_mode):
    os.chdir("particle-aa")
    self.beta_mode = beta_mode
    super().__init__(version)

  def publish(self):
    self.prepare()
    self.self_prepare()
    self.rn_get()
    self.rn_publish()
    self.close()


class ParticleWalletModule(ParticleBase):
  beta_name = "rn-wallet-beta"
  production_name = "@particle-network/rn-wallet"

  def __init__(self, version, beta_mode):
    os.chdir("particle-wallet")
    self.beta_mode = beta_mode
    super().__init__(version)

  def publish(self):
    self.prepare()
    self.self_prepare()
    self.rn_get()
    self.rn_publish()
    self.close()


if __name__ == "__main__":
  version = '2.0.3'
  betaMode = False
  sleep_time = 0
  print("Base Start")
  ParticleBaseModule(version, betaMode).publish()
  print("Base Finish")
  time.sleep(sleep_time)

  print("AuthCore Start")
  ParticleAuthCoreModule(version, betaMode).publish()
  print("AuthCore Finish")
  time.sleep(sleep_time)

  # print("Connect Start")
  # ParticleConnectModule(version, betaMode).publish()
  # print("Connect Finish")

  # time.sleep(sleep_time)
  # print("ParticleAA Start")
  # ParticleAAModule(version, betaMode).publish()
  # print("ParticleAA Finish")
  # time.sleep(sleep_time)
  # print("ParticleWallet Start")
  # ParticleWalletModule(version, betaMode).publish()
  # print("ParticleWallet Finish")
