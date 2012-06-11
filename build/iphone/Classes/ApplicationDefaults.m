/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"OeTiYjzmVLGrjoSJxKEYqRr2lOeRBL0J"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"qebiVIeQiyTfig8uJbdG3z8smSowP1sR"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"39CduDnFWI91vREX6cqyJHzi8BCEFyAB"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"W1cVVK1vFvx9V2oIPLNQMypSsvZZws59"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"kofS0Or4pK6vzzIahnVtnU9rdhcEwTf0"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"RUIpirPF0fxzsPtriY7vaDhUlMVGOIWG"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];

    return _property;
}
@end
