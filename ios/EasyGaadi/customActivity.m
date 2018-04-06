//
//  customActivity.m
//  EasyGaadi
//
//  Created by Sharath Koppolu on 23/03/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
//#import "Reachability.h"
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

//RCT_EXPORT_METHOD(connectionInfo:(RCTResponseSenderBlock)callback)
//{
////  NSUUID *uuid = [NSUUID UUID];
////  NSString *uuidString = uuid.UUIDString;
////  callback(@[[NSNull null], uuidString]);
//  Reachability *networkReachability = [Reachability reachabilityForInternetConnection];
//  NetworkStatus networkStatus = [networkReachability currentReachabilityStatus];
//  if (networkStatus == NotReachable) {
//    NSLog(@"There IS NO internet connection");
//  } else {
//    NSLog(@"There IS internet connection");
//  }
//  
//    callback(@[[NSNull null], @"networkStatus"]);
//
//}

@end


