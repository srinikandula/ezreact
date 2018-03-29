//
//  customActivity.m
//  EasyGaadi
//
//  Created by Sharath Koppolu on 23/03/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "customActivity.h"
#import <React/RCTLog.h>

@implementation customActivity
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(findEvents:(RCTResponseSenderBlock)callback)
{
  NSUUID *uuid = [NSUUID UUID];
  NSString *uuidString = uuid.UUIDString;
  callback(@[[NSNull null], uuidString]);
  
}


@end


