/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

#import "TracingManager.h"
#import "STAYAWAY_COVID-Swift.h"


@implementation TracingManager


static TracingManagerGlue* tm;

- (instancetype)init
{
  self = [super init];
  if (self) {
    tm = TracingManagerGlue.shared;
  }
  return self;
}

- (void)eventReceived:(NSDictionary*) dict
{
  [self sendEventWithName:@"fct.inesctec.stayaway.ios.sdk.UPDATE_EVENT" body:dict];
}

+ (BOOL)requiresMainQueueSetup { return YES;}

// To export a module named TracingManager
RCT_EXPORT_MODULE();

RCT_EXTERN_METHOD(supportedEvents)

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"fct.inesctec.stayaway.ios.sdk.UPDATE_EVENT"];
}

RCT_REMAP_METHOD(isTracingEnabled, isTracingEnabledWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  tm.father = self;
  [tm isTracingEnabled:resolve rejecter:reject];
}

RCT_REMAP_METHOD(start, startWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  tm.father = self;
  [tm start:resolve rejecter:reject];
}

RCT_REMAP_METHOD(stop, stopWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [tm stop:resolve rejecter:reject];
}

RCT_REMAP_METHOD(getStatus, getStatusWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [tm getStatus:resolve rejecter:reject];
}

RCT_REMAP_METHOD(sync, syncWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [tm sync:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(exposed: (NSString*)code
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [tm exposedWithCode:code resolver:resolve rejecter:reject];
}

RCT_REMAP_METHOD(resetInfectionStatus, resetInfectionStatusWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [tm resetInfectionStatus:resolve rejecter:reject];
}

@end
