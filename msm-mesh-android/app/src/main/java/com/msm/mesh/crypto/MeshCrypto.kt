package com.msm.mesh.crypto

import java.security.KeyPair
import java.security.KeyPairGenerator
import java.security.MessageDigest
import java.security.Signature
import java.security.spec.ECGenParameterSpec
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.KeyAgreement
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

class MeshCrypto {
    private val keyPair: KeyPair
    val publicKey: String

    init {
        val kpg = KeyPairGenerator.getInstance("EC")
        kpg.initialize(ECGenParameterSpec("secp256r1"))
        keyPair = kpg.generateKeyPair()
        publicKey = Base64.getEncoder().encodeToString(keyPair.public.encoded)
    }

    fun sign(data: ByteArray): ByteArray {
        val signature = Signature.getInstance("SHA256withECDSA")
        signature.initSign(keyPair.private)
        signature.update(data)
        return signature.sign()
    }

    fun verify(data: ByteArray, signatureBytes: ByteArray, publicKeyBytes: ByteArray): Boolean {
        return try {
            val keyFactory = java.security.KeyFactory.getInstance("EC")
            val pubKey = keyFactory.generatePublic(java.security.spec.X509EncodedKeySpec(publicKeyBytes))
            val signature = Signature.getInstance("SHA256withECDSA")
            signature.initVerify(pubKey)
            signature.update(data)
            signature.verify(signatureBytes)
        } catch (e: Exception) { false }
    }

    fun hash(data: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        return Base64.getEncoder().encodeToString(digest.digest(data.toByteArray()))
    }

    fun deriveSharedSecret(peerPublicKeyBytes: ByteArray): ByteArray {
        val keyFactory = java.security.KeyFactory.getInstance("EC")
        val peerPubKey = keyFactory.generatePublic(java.security.spec.X509EncodedKeySpec(peerPublicKeyBytes))
        val keyAgreement = KeyAgreement.getInstance("ECDH")
        keyAgreement.init(keyPair.private)
        keyAgreement.doPhase(peerPubKey, true)
        return keyAgreement.generateSecret()
    }

    fun encrypt(data: ByteArray, sharedSecret: ByteArray): ByteArray {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val secretKey = SecretKeySpec(MessageDigest.getInstance("SHA-256").digest(sharedSecret).copyOf(16), "AES")
        cipher.init(Cipher.ENCRYPT_MODE, secretKey)
        val iv = cipher.iv
        val encrypted = cipher.doFinal(data)
        return iv + encrypted
    }

    fun decrypt(data: ByteArray, sharedSecret: ByteArray): ByteArray {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val secretKey = SecretKeySpec(MessageDigest.getInstance("SHA-256").digest(sharedSecret).copyOf(16), "AES")
        val iv = data.copyOfRange(0, 12)
        val encrypted = data.copyOfRange(12, data.size)
        cipher.init(Cipher.DECRYPT_MODE, secretKey, GCMParameterSpec(128, iv))
        return cipher.doFinal(encrypted)
    }

    companion object {
        @Volatile private var instance: MeshCrypto? = null
        fun getInstance(): MeshCrypto = instance ?: synchronized(this) {
            instance ?: MeshCrypto().also { instance = it }
        }
    }
}
