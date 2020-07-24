/*
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

/*
 * Copyright (c) 2020 Ubique Innovation AG <https://www.ubique.ch>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * SPDX-License-Identifier: MPL-2.0
 */

package fct.inesctec.stayaway.tracing.internal.networking;

import fct.inesctec.stayaway.tracing.internal.networking.models.AuthenticationCodeRequestModel;
import fct.inesctec.stayaway.tracing.internal.networking.models.AuthenticationCodeResponseModel;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface AuthCodeService {

    @Headers({
            "accept: */*",
            "content-type: application/json"
    })
    @POST("v1/onset")
    Call<AuthenticationCodeResponseModel> getAccessToken(@Body AuthenticationCodeRequestModel code);

}
