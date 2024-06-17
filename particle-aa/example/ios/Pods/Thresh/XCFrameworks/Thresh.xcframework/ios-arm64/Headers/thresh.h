#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

char *thresh_eddsa_keygen(const char *c_endpoint, const char *c_auth_params);

char *thresh_eddsa_to(const char *c_key);

char *thresh_eddsa_sign(const char *c_endpoint,
                        const char *c_auth_params,
                        const char *c_message,
                        const char *c_key);

char *thresh_ecdsa_keygen(const char *c_endpoint, const char *c_auth_params);

char *thresh_ecdsa_pub(const char *c_key);

char *thresh_ecdsa_to(const char *c_key);

char *thresh_ecdsa_sign(const char *c_endpoint,
                        const char *c_auth_params,
                        const char *c_message,
                        const char *c_ecdsa_key,
                        const char *c_uniq_sign);

char *thresh_ecdsa_sign_tx(const char *c_endpoint,
                           const char *c_auth_params,
                           const char *c_message,
                           const char *c_ecdsa_key);

char *thresh_ecdsa_rotate(const char *c_endpoint,
                          const char *c_auth_params,
                          const char *c_ecdsa_key);

char *thresh_hash_password(const char *c_password, const char *c_salt);

char *thresh_encrypt(const char *c_plaintext, const char *c_key);

char *thresh_decrypt(const char *c_ciphertext, const char *c_key);
