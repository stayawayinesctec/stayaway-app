/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

/**
* Copyright (c) 2020 Ubique Innovation AG <https://www.ubique.ch>
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.
*
* SPDX-License-Identifier: MPL-2.0
*/

import BackgroundTasks
import Foundation

class FakePublishManager {
  static let shared = FakePublishManager()

  private let queue = DispatchQueue(label: "org.dpppt.fakepublishmanager")

  private let operationQueue: OperationQueue = {
    let queue = OperationQueue()
    queue.maxConcurrentOperationCount = 1
    return queue
  }()

  private var nextScheduledFakeRequestDateStore: Date?

  enum ExponentialDistribution {
    /// Get a random double using an exponential distribution
    /// - Parameter rate: The inverse of the upper limit
    /// - Returns: A random double between 0 and the limit
    static func sample(rate: Double = 1.0) -> Double {
      assert(rate > 0, "Cannot divide by 0")
      // We use -log(1-U) since U is [0, 1)
      return -log(1 - Double.random(in: 0 ..< 1)) / rate
    }
  }

  var nextScheduledFakeRequestDate: Date? {
    queue.sync {
      self.nextScheduledFakeRequestDateStore
    }
  }

  var now: Date {
    .init()
  }

  private func syncInterval() -> TimeInterval {
    let rate: Double = 0.2
    let randomDay = ExponentialDistribution.sample(rate: rate)
    let secondsInADay = Double(24 * 60 * 60)
    return randomDay * secondsInADay
  }

  private func getNewScheduleDate() -> Date {
    Date(timeInterval: syncInterval(), since: now)
  }

  @discardableResult
  func rescheduleFakeRequest(force: Bool = false) -> Date {
    queue.sync {
      var nextDate = nextScheduledFakeRequestDateStore ?? getNewScheduleDate()

      if nextDate <= now || force {
        nextDate = getNewScheduleDate()
      }

      nextScheduledFakeRequestDateStore = nextDate
      return nextDate
    }
  }

  @discardableResult
  func runTask(completionBlock: (() -> Void)? = nil) -> Operation {
    let operation = FakePublishOperation(manager: self)
    operation.completionBlock = completionBlock
    operationQueue.addOperation(operation)
    return operation
  }
}

private class FakePublishOperation: Operation {
  weak var manager: FakePublishManager!

  init(manager: FakePublishManager) {
    self.manager = manager
    super.init()
  }

  override func main() {
    guard isCancelled == false else { return }

    guard let startDate = manager.nextScheduledFakeRequestDate,
      Date() >= startDate else {
        NSLog("Too early for fake request")
        return
    }

    // add a delay so its not guessable from http traffic if a report was fake or not
    var delay: TimeInterval { Double.random(in: 20 ... 30) }
    let group = DispatchGroup()
    group.enter()
    DispatchQueue.global(qos: .background).asyncAfter(deadline: .now() + delay) { [weak self] in
      ReportingManager.shared.report(isFakeRequest: true) { [weak self] error in
        guard let self = self else { return }
        if error != nil {
          self.cancel()
        } else {
          self.manager.rescheduleFakeRequest()
        }
        group.leave()
      }
    }
    group.wait()
  }
}
