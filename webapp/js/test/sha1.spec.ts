import 'jest'
import crypto from 'crypto-js'

describe("sha1 test", function(){
    it("creates a proper checksum", function(){
        const digest = crypto.SHA1("test")
        expect(digest.toString()).toBe("a94a8fe5ccb19ba61c4c0873d391e987982fbbd3")
    })
})